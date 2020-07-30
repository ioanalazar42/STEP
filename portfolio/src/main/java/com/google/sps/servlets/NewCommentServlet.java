package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
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
    UserService userService = UserServiceFactory.getUserService();

    if (!userService.isUserLoggedIn()) {
      response.setContentType("text/html");
      response.getWriter().println("Please login to comment");
      return;
    }

    String body = request.getParameter("comment-input");
    if (body.equals("")) {
      response.setContentType("text/html");
      response.getWriter().println("Please enter a non-empty comment.");
      return;
    }

    long timestamp = System.currentTimeMillis();
    String userEmail = userService.getCurrentUser().getEmail();
    // score will only get computed if user specifically requests it
    float score = 0;

    Entity commentEntity = new Entity("Comment");
    commentEntity.setProperty("body", body);
    commentEntity.setProperty("timestamp", timestamp);
    commentEntity.setProperty("email", userEmail);
    commentEntity.setProperty("score", score);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(commentEntity);

    response.sendRedirect("/index.html");
  }
}
