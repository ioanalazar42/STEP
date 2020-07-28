package com.google.sps.servlets;

import com.google.appengine.api.datastore.*;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/login-status")
public class LoginServlet extends HttpServlet {
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    UserService userService = UserServiceFactory.getUserService();

    boolean loggedIn = userService.isUserLoggedIn();

    String url = loggedIn ?  userService.createLogoutURL("list-comments") : 
        userService.createLoginURL("list-comments");

    response.setContentType("application/json;");
    response.getWriter().println(toJson(loggedIn, url));
  }

  /* Return json string that specifies if the user is logged in and
    provides a login/logout url */
  public String toJson(boolean loggedIn, String url) {

    String json = "{\"logged\": ";

    if (loggedIn) {
      json += "\"true\"";
    } else {
      json += "\"false\"";
    }

    json += ", ";
    json += "\"url\": ";
    json += "\"" + url + "\"}";

    return json;
  }
}
