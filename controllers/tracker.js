const Tracker = require("../models/Tracker");
const User = require("../models/User");
const Job = require("../models/Job");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const { findByIdAndUpdate } = require("../models/User");


exports.create = async (req, res) => {
    try {
        const user = req.session.userID;
        const jobName = req.body.jobName;
        const date = req.body.date;
        const startTime = req.body.startTime;
        const endTime = req.body.endTime;
        const jobs = await Job.find({ user: req.session.userID })

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

        // Old method of calculating the Time worked
        // let timeStart = new Date(currDate + " " + startTime).getHours();
        // let timeEnd = new Date(currDate + " " + endTime).getHours();

        // let difference = timeEnd - timeStart;
        // if(difference < 0){
        //     difference = difference * -1
        // }

        // New Method for calculating hours worked
        let timeStartHours = new Date(currDate + " " + startTime).getHours();
        let timeStartMinutes = new Date(currDate + " " + startTime).getUTCMinutes();
        console.log(parseFloat(timeStartHours + "." + timeStartMinutes).toFixed(2));
        // Joining the minutes and hours together creating a double number to give a more accurate difference between the two times.
        let timeStart = parseFloat(timeStartHours + "." + timeStartMinutes).toFixed(2);

        let timeEndHours = new Date(currDate + " " + endTime).getHours();
        let timeEndMinutes = new Date(currDate + " " + endTime).getUTCMinutes();
        console.log(parseFloat(timeEndHours + "." + timeEndMinutes).toFixed(2));
        let timeEnd = parseFloat(timeEndHours + "." + timeEndMinutes).toFixed(2);

        let difference = (timeEnd - timeStart).toFixed(2);
        if(difference < 0){
            difference = difference * -1
        }
        // console.log("duration: "+difference);
       
        if(req.body.jobName !== "null"){
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
        }else{
            res.render('create-tracker', { errors: {message: "Unable to use this job. Please Create a new Job"}, maxDate: null, jobs: jobs });
            return;
        }
        
    } catch(e) {
        console.log(e)
        if (e.errors) {
            res.render('create-tracker', { errors: e, maxDate: null, jobs: [] })
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

exports.edit = async (req, res) => {
    const trackerID = req.params["id"];

    try {
        console.log(`Looking for Tracker object with ID: ${trackerID}`);
        const trackerObject = await Tracker.findById(trackerID);
        console.log(`Tracker Object: ${trackerObject}`);

        console.log(`Looking for the Job connected to the Tracker Object: ${trackerObject._id}`);

        const curJob = await Job.findById(trackerObject.job);

        // Finding the current date the page was opened to help us create a maxdate that the users can go up to
        console.log(`Finding max Date allowable for the date section in Tracker`);
        const curDate = Date.now();
        const maxDate = new Date(curDate);
        const month = maxDate.getUTCMonth() + 1;
        let dateCombined;
        if (month < 10){
            dateCombined = `${maxDate.getFullYear()}-0${month}-${maxDate.getDate()}`;
            // console.log(`Single Digit month: ${dateCombined}`);
        }else{
            dateCombined = `${maxDate.getFullYear()}-${month}-${maxDate.getDate()}`;
            // console.log(`Double Digit month: ${dateCombined}`);
        }
        const user = await User.findById(req.session.userID)
        console.log(`Looking for Jobs associated with User: ${user.email}`);
        const jobs = await Job.find({ user: req.session.userID });


        res.render('edit-tracker', {errors: {}, maxDate: dateCombined, jobs: jobs, tracker: trackerObject, curJob: curJob});
        return;
    } catch (e){
        console.log(e)
        if (e.errors) {
            res.render('edit-tracker', { errors: e.errors, maxDate: "", jobs: [], tracker: {}, curJob: ""})
            return;
        }
        return res.status(400).send({
            message: e.message,
        });
    }
};

exports.update = async (req, res) => {
    console.log(`!!!UPDATING TRACKER OBJECT!!!`);

    try {
        const objectID = req.params["id"];
        const jobID = req.body.jobName;
        const date = req.body.date;
        const startTime = req.body.startTime;
        const endTime = req.body.endTime;
        const user = req.session.userID;

        console.log(`ObjectID: ${objectID}, jobID: ${jobID}, date: ${date}, startTime: ${startTime}, endTime: ${endTime}`);

        // Calculating Total Hours Worked
        console.log(`calculating Total Hours Worked`);
        let currDate = new Date();
        let month = currDate.getMonth()+1;
        let day = currDate.getDate();
        let year = currDate.getFullYear();

        currDate = `${month}/${day}/${year}`;

        // Old method of calculating the Time worked
        // let timeStart = new Date(currDate + " " + startTime).getHours();
        // let timeEnd = new Date(currDate + " " + endTime).getHours();

        // let difference = timeEnd - timeStart;
        // if(difference < 0){
        //     difference = difference * -1
        // }

        // New Method for calculating hours worked
        let timeStartHours = new Date(currDate + " " + startTime).getHours();
        let timeStartMinutes = new Date(currDate + " " + startTime).getUTCMinutes();
        console.log(parseFloat(timeStartHours + "." + timeStartMinutes).toFixed(2));
        // Joining the minutes and hours together creating a double number to give a more accurate difference between the two times.
        let timeStart = parseFloat(timeStartHours + "." + timeStartMinutes).toFixed(2);

        let timeEndHours = new Date(currDate + " " + endTime).getHours();
        let timeEndMinutes = new Date(currDate + " " + endTime).getUTCMinutes();
        console.log(parseFloat(timeEndHours + "." + timeEndMinutes).toFixed(2));
        let timeEnd = parseFloat(timeEndHours + "." + timeEndMinutes).toFixed(2);

        let difference = (timeEnd - timeStart).toFixed(2);
        if(difference < 0){
            difference = difference * -1
        }
        
        console.log(`Total Hours Worked: ${difference}`);
        
        const trackerObject = await Tracker.findById(objectID);

        console.log(`Attempting to find Tracker Object and update with new values`);
        // console.log(`TRACKER OBJECT: ${trackerObject}`);

        // await Tracker.findOneAndUpdate(trackerObject, { 
        //     date: date, 
        //     startTime: startTime, 
        //     endTime: endTime, 
        //     totalHours: difference, 
        //     job: jobID,
        //     user: user
        // }, {new: true} ,(error, data) => {
        //     if(error){
        //         console.log(`Error Updating Record: ${error}`);
        //     } else {
        //         console.log(`Record Updated: ${data}`);
        //     }
        // })

        await Tracker.findByIdAndUpdate(objectID, {
            date: date, 
            startTime: startTime, 
            endTime: endTime, 
            totalHours: difference, 
            job: jobID,
            user: user
        }, {new: true} ,(error, data) => {
            if(error){
                console.log(`Error Updating Record: ${error}`);
            } else {
                console.log(`Record Updated: ${data}`);
            }
        })

        console.log(`Update Compelete!`);

        res.redirect("/?message=taster has been updated");        
    } catch (e){
        console.log(e)
        if (e.errors) {
            res.render('edit-tracker', { errors: e.errors, maxDate: "", jobs: [], tracker: {}, curJob: ""})
            return;
        }
        return res.status(400).send({
            message: e.message,
        });
    }
}

exports.delete = async (req, res) => {
    const trackerID = req.params["id"];

    try {
        console.log(`Attempting to Delete Tracker: ${trackerID}`);

        await Tracker.findByIdAndRemove(trackerID);
        console.log(`Tracker: ${trackerID} Deleted!`);
        res.redirect("/");
    } catch (e) {
        console.log(`Deletion of Tracker: ${trackerID} Failed`);
        res.status(404).send({
            message: e.message,
        });
    }
    // console.log(trackerID);
}