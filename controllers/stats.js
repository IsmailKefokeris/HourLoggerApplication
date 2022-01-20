const expressSession = require("express-session");
const User = require("../models/User");
const Job = require("../models/Job");
const Tracker = require("../models/Tracker");
const { Double } = require("mongodb");

exports.renderPage = async (req, res) => {
    const userID = req.session.userID;

    try {
        const jobs = await Job.find({ user: userID });
        const trackers = await Tracker.find({ user: userID });
        const user = await User.findById(userID);
        var totalEarned = 0.0;
        let weekEarned = 0.0;
        let monthEarned = 0.0;

        // console.log(jobs);

        res.render("user-stats", {jobs: jobs,  user: user, totalEarned: totalEarned, weekEarned: weekEarned, monthEarned: monthEarned});
    } catch (e) {
        console.log(`ERROR: ${e}`);
    }
}
