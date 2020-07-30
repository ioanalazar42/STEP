package com.google.sps.data;

import com.google.appengine.api.datastore.Entity;

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

  public static Comment createCommentFromEntity(Entity commentEntity) {
    long id = commentEntity.getKey().getId();
    String body = (String) commentEntity.getProperty("body");
    long timestamp = (long) commentEntity.getProperty("timestamp");
    String email = (String) commentEntity.getProperty("email");
    double score = (double) commentEntity.getProperty("score");

    return new Comment(id, body, timestamp, email, score);
  }
}
