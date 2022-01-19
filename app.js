// Adding required dependencies
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressSession = require("express-session");

const crypto = require("crypto");

// Controllers
const homeController = require("./controllers/home");
const userController = require("./controllers/user");
const jobController = require("./controllers/job");
const trackerController = require("./controllers/tracker");

// API
const homeApiController = require("./controllers/api/home");


// Models
const User = require("./models/User");


// Creating our app and setting templating system
const app = express();
app.set("view engine", "ejs");

// Encoding of request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/static'));

// Setting our Port and mongoDB location through .env
const { PORT, MONGODB_URI } = process.env;

// Connecting to Database

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
mongoose.connection.on("error", (err) => {
  console.error(err);
  console.log(
    "MongoDB connection error. Please make sure MongoDB is running.",
    chalk.red("✗")
  );
  process.exit();
});

app.use(expressSession({ secret: `${crypto.randomUUID()}`, cookie: { expires: new Date(253402300000000) }, resave: true, saveUninitialized: true }))

// Creating a Global variable (User)
global.user = false;
app.use("*", async (req, res, next) => {
  if (req.session.userID && !global.user) {
    const user = await User.findById(req.session.userID);
    global.user = user; // now that our user is a global variable it can be accessed anywhere (including ejs)
  }
  next();
});

// Creating Authentication Middleware

const authMiddleware = async (req, res, next) => {
  const user = await User.findById(req.session.userID);
  if (!user) {
    return res.render("home", {message: "You must be Logged in to do this!", jobs: [], trackers: [], totalHours: 0});
  }
  next()
}

// console.log(`LOGGING: ${crypto.randomUUID()}`);

// Home Page
app.get("/", homeController.list);

app.get("/view/:id", authMiddleware, homeController.view);

app.get("/edit/:id", authMiddleware, trackerController.edit);
app.post("/update-tracker/:id", authMiddleware, trackerController.update);


app.get("/delete/:id", authMiddleware, trackerController.delete);

app.get("/api/view", homeApiController.view);



// Login Page
app.get("/login", (req, res) => {
  res.render("login", {errors: {}});
});

app.post("/login", userController.login);

// Register Page
app.get("/register", (req, res) => {
  res.render("register", {errors: {}});
});

app.post("/register", userController.register);

// Logout 
app.get("/logout", (req, res) => {
  req.session.destroy();
  global.user = false;
  res.redirect("/");
});

// Create job Page
app.get("/create-job", authMiddleware, (req, res) => {
  res.render("create-job", {errors: {}});
});

app.post("/create-job", authMiddleware, jobController.create);


// Create Tracker Page
app.get("/create-tracker", authMiddleware, trackerController.list);

app.post("/create-tracker", authMiddleware, trackerController.create);

// View User Stats Page

app.get("/view-stats", (req, res) => {
  res.render("user-stats");
});



app.listen(PORT, () => {
    console.log(
      `Hour Logger App Live at: http://localhost:${PORT}`
    );
});
