import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import bodyParser from "body-parser";
import * as db from "./database.js";

const app = express();
app.use(
  cookieSession({
    secret: "cookiesecret",
    signed: false,
    name:"__session"
  })
);
app.use(cookieParser());
app.use(cors());
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/api/class-session/:sessionCode", (req, res) => {
  /**
   * CS-5356-TODO
   * Get a Class Session by Session Code
   *
   * Using `db`, find the class session using the session code, and return:
   * 200 OK - with an object containing the questions for that class session
   * 404 Not Found - when there is no class session with that code
   *
   * All users should have access
   */

  // Find questions by first checking sessionID
  // If session is valid, return the session object
  // Otherwise, return 404

  const findSession = db.getSessionById(req.params.sessionCode)

  if (!findSession) {
    res.status(404).send()
    return;
  }

  res.status(200).send(findSession);
  // if (findSession) { 
  //   res.status(200).send(findSession.questions);
  //   return
  // } else {
  //   res.status(404).send()
  //   return
  // }
});

app.post("/api/class-session/:sessionCode/question", (req, res) => {
  /**
   * CS-5356-TODO
   * Create a Question for a Class Session by Session Code
   *
   * Using `db`, find the class session using the session code, and
   * add a new question to the list.
   *
   * Return:
   * 201 Created - with the new question object
   * 404 Not Found - when there is no class session with that code
   *
   * All users should have access
   */

  const newQuestion = db.createQuestionForSession(req.params.sessionCode, req.body);

  if (!newQuestion) {
    res.status(404).send()
    return
  }

  res.status(201).send(newQuestion);
});

app.put(
  "/api/class-session/:sessionCode/question/:questionId/upvote",
  (req, res) => {
    /**
     * CS-5356-TODO
     * Upvote a question in a session
     *
     * Using `db`, find the class session using the session code, and
     * then find the question using the question id. Increase the amount
     * of question.upvote by 1.
     *
     * Return:
     * 201 Created - with the updated question object
     * 404 Not Found - when there is no class session with that code, or no question
     *   with that id was found
     *
     * All users should have access
     */

    const newUpvote = db.upvoteQuestionForSession(req.params.sessionCode, req.params.questionId);

    if (!newUpvote) {
      res.status(404).send()
      return
    }
  
    res.status(201).send(newUpvote)
  }
);

app.post("/api/class/:classId/session-code", (req, res) => {
  /**
   * CS-5356-TODO
   * Create a new Class Session for a Class
   *
   * Using `db`, find the class using the class id, and
   * add  a new session to the class
   *
   * Return:
   * 201 Created - with the new class session object
   * 401 Unauthorized - if user is not allowed to access. Only the
   *   owner of the class should be able to create a new class session
   * 404 Not Found - when there is no class with that id
   */

  // If user is not logged in, send 401
  if (!req.session.username) {
    res.status(401).send('Unauthorized')
    return
  }

  // Find class by classId 
  const findClass = db.getClassById(req.params.classId);

  if (!findClass) {
    res.status(404).send("Unable to find class")
    return
  }
  // Check if user is owner
  if (findClass.owner !== req.session.username) {
    res.status(401).send('Unauthorized')
    return
  } 
  
  const newClassSession = db.createSessionCodeForClass(req.params.classId);
  if (newClassSession) {
    res.status(201).send(newClassSession);
  } else {
    res.status(404).send('Not Found')
  }
});

app.get("/api/classes", (req, res) => {
  /**
   * CS-5356-TODO
   * List all classes that belong to the current user
   *
   * Using `db`, find all the classes that belong to the
   * current user, and return it
   *
   * Return:
   * 200 OK - with an array of all the classes. Should return an empty array
   *   if user has no classes yet.
   * 401 Unauthorized - when there is no current user
   *
   * Users should only see their own classes, and not those belonging to
   * other users
   */

  console.log('req.session', req.session);
  console.log('req.cookies', JSON.stringify(req.cookies));
  if (!req.session.username) {
    res.status(401).send('Unauthorized - no current user')
    return
  }

  const classInfo = db.getClassesByOwner(req.session.username)
  res.status(200).send({ classes: classInfo, });
});

app.post("/api/classes", (req, res) => {
  /**
   * CS-5356-TODO
   * Create a new Class
   *
   * Using `db`, create a new class using the provided name and add
   * to the list of classes
   *
   * Return:
   * 201 Created - with the new class object
   * 400 Bad Request - when the request body is missing the name field
   * 401 Unauthorized - Only signed in users should be able to create a class
   *
   */

  if (!req.session.username) {
    res.status(401).send('Oops no user logged in')
    return
  }

  if (!req.body.name) {
    res.status(400).send('Missing name from body')
    return
  }

  const classInfo = db.createClass({ name: req.body.name, owner: req.session.username })
  res.status(201).send(classInfo)
});

app.post("/api/login", (req, res) => {
  /**
   * CS-5356-TODO
   * Login the user using our mock login
   *
   * Only a username is provided for our mock login system.
   * Get the username from the request body and to a cookie
   * session to begin their logged in session.
   *
   * Return:
   * 200 OK - no body
   * 400 Bad Request - when no username is provided
   *
   */
  const { username } = req.body
  if (username) {
    // Create a cookie named session, and the value of that cookie will be an encrypted string that contains an object with
    // a property called username
    req.session.username = username
    res.status(200).send()
  } else {
    res.status(400).send('missing username')
  }
});

app.get("/api/logout", (req, res) => {
  /**
   * CS-5356-TODO
   * Logout
   *
   * Log the current user out by deleting their cookie session
   *
   * Return:
   * 200 OK - no body
   *
   */
  req.session = null
  res.status(200).send();
});

app.get("/api/user", (req, res) => {
  /**
   * CS-5356-TODO
   * Get the current user
   *
   * Get the current user's info by reading their username from
   * their cookie session.
   *
   * Return:
   * 200 OK - when there is a current user based on the cookie session
   * 401 Unauthorized - when there is no current user
   *
   */
  if (!req.session.username) {
    res.status(401).send('missing session')
    return
  }
  const { username } = req.session
  res.status(200).send({ username });
});

export default app;
