const Tracker = require("../models/Tracker");
const User = require("../models/User");
const Job = require("../models/Job");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");


exports.create = async (req, res) => {
    try {
        const user = req.session.userID;
        const jobName = req.body.jobName;
        const date = req.body.date;
        const startTime = req.body.startTime;
        const endTime = req.body.endTime;

        console.log(`user: ${user}, jobName: ${jobName}, date: ${date}, startTime: ${startTime}, endTime: ${endTime}`);

        if(!req.body.jobName){
            console.log("Unable to find Job");
        }

        // Calculating Total Hours Worked
        let currDate = new Date();
        let month = currDate.getMonth()+1;
        let day = currDate.getDate();
        let year = currDate.getFullYear();

        currDate = `${month}/${day}/${year}`;

        let timeStart = new Date(currDate + " " + startTime).getHours();
        let timeEnd = new Date(currDate + " " + endTime).getHours();

        let difference = timeEnd - timeStart;
        if(difference < 0){
            difference = difference * -1
        }
        console.log("duration: "+difference);
       

        console.log(`creating Tracker for Job: ${req.body.jobName}`)

        await Tracker.create({
            date: req.body.date,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            totalHours: difference,
            job: req.body.jobName,
            user: req.session.userID
        })
    
        res.redirect("/");
        return;

    } catch(e) {
        console.log(e)
        if (e.errors) {
            res.render('create-tracker', { errors: e.errors, maxDate: dateCombined, jobs: null })
            return;
        }
        return res.status(400).send({
            message: JSON.parse(e),
        });
    }
};

exports.list = async (req, res) => {
    const message = req.query.message;

    // Finding the current date the page was opened to help us create a maxdate that the users can go up to
    const curDate = Date.now();
    const maxDate = new Date(curDate);
    const month = maxDate.getUTCMonth() + 1;
    let dateCombined;
    if (month < 10){
        dateCombined = `${maxDate.getFullYear()}-0${month}-${maxDate.getDate()}`;
        console.log(`Single Digit month: ${dateCombined}`);
    }else{
        dateCombined = `${maxDate.getFullYear()}-${month}-${maxDate.getDate()}`;
        console.log(`Double Digit month: ${dateCombined}`);
    }


    try {
        // Find User
        // console.log(`ID: ${req.session.userID}`)
        const user = await User.findById(req.session.userID);
        // console.log(user)
        if (!user) {
            res.redirect("/");
            console.log("Cannot find User!");
            return;
        }

        const jobs = await Job.find({ user: req.session.userID })

        res.render('create-tracker', {errors: {}, maxDate: dateCombined, jobs: jobs});
        return;
    } catch (e) {
        console.log(e)
        if (e.errors) {
            res.render('create-tracker', { errors: e.errors, maxDate: dateCombined, jobs: null })
            return;
        }
        return res.status(400).send({
            message: JSON.parse(e),
        });
    }
};
