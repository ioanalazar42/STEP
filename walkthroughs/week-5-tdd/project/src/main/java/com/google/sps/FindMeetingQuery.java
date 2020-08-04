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
import java.util.List;
import java.util.Set;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    /* request is longer than a whole day, don't return any slots */
    if (request.getDuration() > TimeRange.WHOLE_DAY.duration()) {
      return Arrays.asList();
    }

    /* if there are no events or request has no attendees, meeting can be scheduled anytime */
    if (events.isEmpty() || request.getAttendees().isEmpty()) {
      return Arrays.asList(TimeRange.WHOLE_DAY);
    }

    /* Reduce events to only the set of events that have at least one common atendee with
    the atendees in the meeting request. We don't care about events whose atendees don't
    overlap with the atendees in the request */
    Collection<Event> eventClashes = eventsThatClashWithRequest(events, request.getAttendees());

    /* find meeting slots that do not clash with existent events */
    return possibleSlots(eventClashes, request.getDuration());
  }

  /**
   * Get {@code Event}s which have attendees in common with those in the meeting request.Store these
   * events in a list and sort them in ascending order by their start times
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
}
