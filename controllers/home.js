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
        res.render("home", {message: "Login to get started", jobs: [], trackers: [], totalHours: 0});
        return;
    }

    const jobs = await Job.find({ user: req.session.userID })
    // console.log(`Jobs ${jobs}`);
    res.render("home", {message: `WELCOME ${user.email}`, jobs: jobs, trackers: [], totalHours: 0});
    return;
}


// Old Used before Implementing AJAX - New can bew found in api/home.js 
exports.view = async (req, res) => {
    const id = req.params["id"];
    let message = "";

    console.log(id);
    
    try {
        const trackers = await Tracker.aggregate([
            { $match: {job: id}}
        ]);
        if(trackers.length > 0){
            const job = await Job.findById(id);
            message = job.name;
        }else{
            message = "You must Create a Tracker entry first to view this Job!";
        }
        // console.log(`Trackers: ${trackers}`)
        let total = 0;

        trackers.forEach(tracker => {
            total += tracker.totalHours;
        })

        // console.log(total);
        const jobs = await Job.find({ user: req.session.userID })
        res.render("home", {message: message, jobs: jobs, trackers: trackers, totalHours: total});
        return;
    } catch (e) {
        console.log(`ERROR: ${e}`);
    }
}