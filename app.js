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

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on("error", (err) => {
  console.error(err);
  console.log(
    "MongoDB connection error. Please make sure MongoDB is running.",
    chalk.red("✗")
  );
  process.exit();
});

app.use(expressSession({ secret: `${crypto.randomUUID()}`, cookie: { expires: new Date(253402300000000) } }))

// Creating a Global variable (User)
global.user = false;
app.use("*", async (req, res, next) => {
  if (req.session.userID && !global.user) {
    const user = await User.findById(req.session.userID);
    global.user = user; // now that our user is a global variable it can be accessed anywhere (including ejs)
  }
  next();
});

// console.log(`LOGGING: ${crypto.randomUUID()}`);

// @desc:     Home page
// @route:    GET /
app.get("/", (req, res) => {
  res.render("home", {message: `WELCOME`});
});

app.get("/login", (req, res) => {
  res.render("login", {errors: {}});
});

app.post("/login", userController.login);


app.get("/register", (req, res) => {
  res.render("register", {errors: {}});
});

app.post("/register", userController.register);

app.get("/logout", (req, res) => {
  req.session.destroy();
  global.user = false;
  res.redirect("/");
});







app.listen(PORT, () => {
    console.log(
      `Hour Logger App Live at: http://localhost:${PORT}`
    );
});
