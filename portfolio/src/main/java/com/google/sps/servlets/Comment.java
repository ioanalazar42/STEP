package com.google.sps.data;

public final class Comment {

  private final long id;
  private final String body;
  private final long timestamp;
  private final String email;
  private final double score;

  public Comment(long id, String body, long timestamp, String email, double score) {
    this.id = id;
    this.body = body;
    this.timestamp = timestamp;
    this.email = email;
    this.score = score;
  }
}
