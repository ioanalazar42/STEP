package com.google.sps.data;

public final class Comment {

  private final long id;
  private final String body;
  private final long timestamp;

  public Comment(long id, String body, long timestamp) {
    this.id = id;
    this.body = body;
    this.timestamp = timestamp;
  }
}