const expressSession = require("express-session");
const User = require("../models/User");
const Job = require("../models/Job");
const Tracker = require("../models/Tracker");




exports.list = async (req, res) => {
    const message = req.query.message;
    
    // Find User
    // console.log(`ID: ${req.session.userID}`)
    const user = await User.findById(req.session.userID);
    // console.log(user)
    if (!user) {
        res.render("home", {message: "Login to get started", jobs: []});
        return;
    }

    const jobs = await Job.find({ user: req.session.userID })
    // console.log(`Jobs ${jobs}`);
    res.render("home", {message: `WELCOME ${user.email}`, jobs: jobs});
    return;
}

exports.view = async (req, res) => {
    const id = req.param.id;

    try {
        const trackers = await Tracker.find({});
    } catch (e) {

    }
}