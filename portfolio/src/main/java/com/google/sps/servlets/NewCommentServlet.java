package com.google.sps.servlets;

import com.google.cloud.language.v1.Document;
import com.google.cloud.language.v1.LanguageServiceClient;
import com.google.cloud.language.v1.Sentiment;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that creates new comments. */
@WebServlet("/new-comment")
public class NewCommentServlet extends HttpServlet {

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String body = request.getParameter("comment-input");

    if (body.equals("")) {
      response.setContentType("text/html");
      response.getWriter().println("Please enter a non-empty comment.");
      return;
    }

    long timestamp = System.currentTimeMillis();
    float score = sentimentAnalysisScore(body);

    Entity commentEntity = new Entity("Comment");
    commentEntity.setProperty("body", body);
    commentEntity.setProperty("timestamp", timestamp);
    commentEntity.setProperty("score", score);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(commentEntity);

    response.sendRedirect("/index.html");
  }

  /* Return sentiment analysis score based on the content of some text */
  public float sentimentAnalysisScore(String text) throws IOException {
    Document doc =
      Document.newBuilder().setContent(text).setType(Document.Type.PLAIN_TEXT).build();
    LanguageServiceClient languageService = LanguageServiceClient.create();
    Sentiment sentiment = languageService.analyzeSentiment(doc).getDocumentSentiment();
    float score = sentiment.getScore();
    languageService.close();
    return score;
  }
}
