import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.cloud.language.v1.LanguageServiceClient;
import com.google.cloud.language.v1.Document;
import com.google.cloud.language.v1.Sentiment;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import java.io.IOException;
import com.google.gson.Gson;
import com.google.sps.data.Comment;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/sentiment-analysis")
public class SentimentAnalysisServlet extends HttpServlet {
  Entity commentEntity;

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException  {
    long id = Long.parseLong(request.getParameter("id"));

    Key commentEntityKey = KeyFactory.createKey("Comment", id);
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    try {
      commentEntity = datastore.get(commentEntityKey);
      String body = (String) commentEntity.getProperty("body");
      double score = sentimentAnalysisScore(body);
      commentEntity.setProperty("score", score);
      //response.sendRedirect("/index.html");
    //   Comment comment = Comment.createCommentFromEntity(commentEntity);

    //   Gson gson = new Gson();

    //   response.setContentType("application/json;");
    //  response.getWriter().println(gson.toJson(comment));
    } catch (EntityNotFoundException e) {
      System.out.println("Can't fetch entity");
    }
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException  {
    Comment comment = Comment.createCommentFromEntity(commentEntity);

    Gson gson = new Gson();
    String testJSON = "{\"test\": \"yes\"}";
    response.setContentType("application/json;");
    //response.getWriter().println(gson.toJson(comment));
    response.getWriter().println(testJSON);
  }

  /* Return sentiment analysis score based on the content of some text */
  public float sentimentAnalysisScore(String text) throws IOException {
    Document doc = Document.newBuilder().setContent(text).setType(Document.Type.PLAIN_TEXT).build();
    LanguageServiceClient languageService = LanguageServiceClient.create();
    Sentiment sentiment = languageService.analyzeSentiment(doc).getDocumentSentiment();
    float score = sentiment.getScore();
    languageService.close();
    return score;
  }
}