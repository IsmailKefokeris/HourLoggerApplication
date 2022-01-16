const Job = require("../models/Job");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");


exports.create = async (req, res) => {
    try {
        console.log(`creating Job: ${req.body.jobName}`) 

        const jobName = req.body.jobName;
        const jobRate = req.body.rate;
        const userID = req.session.userID;

        const job = await Job.findOne({ name: jobName });

        if(job){
            res.render('create-job', { errors: { name: { message: 'Job Name already exists!' } } })
            return;
        }

        await Job.create({
            name: jobName,
            rate: jobRate,
            user: userID
        })

        res.redirect('/')

    } catch(e) {
        console.log(e)
        if (e.errors) {
            res.render('create-job', { errors: e.errors })
            return;
        }
        return res.status(400).send({
            message: JSON.parse(e),
        });
    }
};