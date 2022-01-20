const expressSession = require("express-session");
const User = require("../models/User");
const Job = require("../models/Job");
const Tracker = require("../models/Tracker");

exports.renderPage = async (req, res) => {
    const userID = req.session.userID;

    try {
        const jobs = await Job.find({ user: userID });
        const user = await User.findById(userID);
        // console.log(jobs);

        res.render("user-stats", {jobs: jobs,  user: user});
    } catch (e) {
        console.log(`ERROR: ${e}`);
    }



}
