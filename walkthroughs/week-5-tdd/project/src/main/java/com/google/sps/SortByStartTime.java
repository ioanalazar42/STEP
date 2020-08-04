package com.google.sps;

import java.util.Comparator;

public class SortByStartTime implements Comparator<Event> {
  public int compare(Event e1, Event e2) {
    return TimeRange.ORDER_BY_START.compare(e1.getWhen(), e2.getWhen());
  }
}
