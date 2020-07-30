package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet responsible for deleting comments. */
@WebServlet("/delete-comment")
public class DeleteCommentServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    try {
      long id = Long.parseLong(request.getParameter("id"));
      Key commentEntityKey = KeyFactory.createKey("Comment", id);
      DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

      // get email of the user who wrote the comment
      Entity commentEntity = datastore.get(commentEntityKey);
      String authorEmail = (String) commentEntity.getProperty("email");

      // get email of current user who is trying to delete comment
      UserService userService = UserServiceFactory.getUserService();
      String currentEmail = userService.getCurrentUser().getEmail();

      response.setContentType("text/html");
      PrintWriter out = response.getWriter();

      if (currentEmail.equals(authorEmail)) {
        datastore.delete(commentEntityKey);
        out.append("Allowed");
      } else {
        out.append("Not allowed");
      }
      out.close();
    } catch (EntityNotFoundException e) {
      System.out.println("Can't fetch entity");
    }
  }
}
