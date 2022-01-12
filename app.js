// Adding required dependencies
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressSession = require("express-session");



// Creating our app and setting templating system
const app = express();
app.set("view engine", "ejs");

// Setting our Port and mongoDB location through .env
const { PORT, MONGODB_URI } = process.env;


app.get("/", (req, res) => {
    res.render("home");
});






app.listen(PORT, () => {
    console.log(
      `Hour Logger App Live at: http://localhost:${PORT}`
    );
});
