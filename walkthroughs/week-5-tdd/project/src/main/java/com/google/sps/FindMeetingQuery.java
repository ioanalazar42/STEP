// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    /* Ensure that duration is positive */
    if (request.getDuration() < 0) {
      throw new IllegalArgumentException("Meeting durations can't be negative");
    }

    /* request is longer than a whole day, don't return any slots */
    if (request.getDuration() > TimeRange.WHOLE_DAY.duration()) {
      return Arrays.asList();
    }

    /* if there are no events or request has no attendees, meeting can be scheduled anytime */
    if (events.isEmpty()) {
      return Arrays.asList(TimeRange.WHOLE_DAY);
    }

    /* we don't care about events whose attendees are not also mandatory/optional attendees in the meeting */
    Collection<Event> eventClashesMandatory = eventsThatClashWithRequest(events, request.getAttendees());
    Collection<Event> eventClashesOptional = eventsThatClashWithRequest(events, request.getOptionalAttendees());

    /* get possible slots for the meeting for both madatory and optional attendees */
    Collection<TimeRange> slotsForMandatory = possibleSlots(eventClashesMandatory, request.getDuration());
    Collection<TimeRange> slotsForOptional = possibleSlots(eventClashesOptional, request.getDuration());

    /* if there are no mandatory attendees, check is there are any slots for optional attendees:
    - if there are not -> mark the whole day as available
    - if there are -> return those slots*/
    if (request.getAttendees().isEmpty()) {
      return (slotsForOptional.isEmpty()) ? Arrays.asList(TimeRange.WHOLE_DAY) 
        : slotsForOptional;
    }

    /* if there are no possible slots for mandatory attendees, we can't schedule meeting */
    if (slotsForMandatory.isEmpty()) {
      return Arrays.asList();
    }

    /* if there are no optional attendees or if there are no sltos possible for optional
    attendees, return slots possible for mandatory attendees */
    if (request.getOptionalAttendees().isEmpty() || slotsForOptional.isEmpty()) {
      return slotsForMandatory;
    }

    /* compute the intersection between the two sets of slots */
    Collection<TimeRange> intersection = intersection(slotsForOptional, slotsForMandatory);
    if (intersection.isEmpty()) {
      return slotsForMandatory;
    } else {
      return intersection;
    }
  }

  /**
   * Get {@code Event}s which have attendees in common with those in the meeting request. Store
   * these events in a list and sort them in ascending order by their start times
   *
   * @param events A list of {@code Event}s
   * @param requestAttendees A collection of attendees belonging to the meeting request
   * @return A sorted list of {@code Event}s
   */
  private Collection<Event> eventsThatClashWithRequest(
      Collection<Event> events, Collection<String> requestAttendees) {

    /* list of events that we keep */
    List<Event> eventsList = new ArrayList<Event>();

    for (Event event : events) {
      Set<String> eventAttendees = event.getAttendees();

      /* keep current event if there is no overlap between
      attendees of event and attendees in the meeting request */
      if (!Collections.disjoint(eventAttendees, requestAttendees)) {
        eventsList.add(event);
      }
    }

    /* sort events by their starting time */
    Collections.sort(eventsList, new SortByStartTime());
    return eventsList;
  }

  /**
   * Get possible slots when meeting can be schedule. Loop through sorted events and repeatedly: -
   * allocate slots between the current time and the time the current event starts (only if the
   * difference between them is >= to the requested meeting duration. - update current time by
   * setting it to the end of the current event.
   *
   * @param events A list of {@code Event}s sorted in ascending order of start time
   * @param meetingDuration The length of the meeting to schedule
   * @return An array of slots when we can schedule the meeting.
   */
  private Collection<TimeRange> possibleSlots(Collection<Event> events, long meetingDuration) {
    Collection<TimeRange> possibleSlots = new ArrayList<>();

    int currentSlotStart = TimeRange.START_OF_DAY;

    for (Event event : events) {
      int eventStart = event.getWhen().start();
      int eventEnd = event.getWhen().end();

      if (eventStart - currentSlotStart >= meetingDuration) {
        TimeRange currentSlot = TimeRange.fromStartEnd(currentSlotStart, eventStart, false);
        possibleSlots.add(currentSlot);
      }

      if (eventEnd > currentSlotStart) {
        // update start of current slot
        currentSlotStart = eventEnd;
      }
    } // for

    /* check if there is one last slot after the last event until end of day */
    if (TimeRange.END_OF_DAY - currentSlotStart >= meetingDuration) {
      TimeRange lastSlot = TimeRange.fromStartEnd(currentSlotStart, TimeRange.END_OF_DAY, true);
      possibleSlots.add(lastSlot);
    }

    return possibleSlots;
  }

  /**
   * Find the intersection of two collections of slots. The intersection between two individual slots
   * is the slot that is contained within the other one. If none of the two slots is contained
   * within the other one, then their intersection is empty.
   *
   * @param mandatory A collection of {@code TimeRange}s that represents meeting slots for mandatory attendees
   * @param optional A collection of {@code TimeRange}s that represents meeting slots for optional attendees
   * @return The intersection of these collections as specified above.
   */
  public Collection<TimeRange> intersection(Collection<TimeRange> mandatory, Collection<TimeRange> optional) {
    Iterator<TimeRange> itMandatory = mandatory.iterator();
    Iterator<TimeRange> itOptional = optional.iterator();

    TimeRange currentMandatory = itMandatory.next();
    TimeRange currentOptional = itOptional.next();

    List<TimeRange> intersection = new ArrayList<TimeRange>();

    /* it is guaranteed that one of the slot collections will reach its final slot and
    then stay there until the other collection catches up */
    while (itMandatory.hasNext() || itOptional.hasNext()) {

      /* if one slot completely contains the other, keep the smaller slot */
      if (currentMandatory.contains(currentOptional)) {
        intersection.add(currentOptional);
      } else if(currentOptional.contains(currentMandatory)) {
        intersection.add(currentMandatory);
      }

      /* point to whichever slot comes earlier (this is why it is guaranteed that
      once one collection reaches its end slot, getting the next slot
      will not be attempted until the other slot collection catches up to it */
      if (currentMandatory.end() > currentOptional.end()) {
        currentOptional = itOptional.next();
      } else {
        currentMandatory = itMandatory.next();
      }
    }

    /* in case there are any remaining last slots, check again which one we keep (if any) */
    if (currentMandatory.contains(currentOptional)) {
      intersection.add(currentOptional);
    } else if(currentOptional.contains(currentMandatory)) {
      intersection.add(currentMandatory);
    }

    return intersection;
  }
}
