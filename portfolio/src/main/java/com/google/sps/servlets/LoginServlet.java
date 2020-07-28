package com.google.sps.servlets;

import com.google.appengine.api.datastore.*;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.Gson;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/login-status")
public class LoginServlet extends HttpServlet {
  /* Struct that holds the user's login state */
  private class UserStatus {
    boolean logged;
    String url;
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    UserService userService = UserServiceFactory.getUserService();

    UserStatus userStatus = new UserStatus();
    userStatus.logged = userService.isUserLoggedIn();
    userStatus.url = userStatus.logged ? userService.createLogoutURL("/") : userService.createLoginURL("/");

    Gson gson = new Gson();

    response.setContentType("application/json;");
    response.getWriter().println(gson.toJson(userStatus));
  }
}
