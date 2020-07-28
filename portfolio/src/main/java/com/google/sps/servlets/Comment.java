package com.google.sps.data;

public final class Comment {

  private final long id;
  private final String body;
  private final long timestamp;
  private final float score;

  public Comment(long id, String body, long timestamp, float score) {
    this.id = id;
    this.body = body;
    this.timestamp = timestamp;
    this.score = score;
  }
}
