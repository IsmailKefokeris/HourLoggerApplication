const User = require("../models/User");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");


exports.register = async (req, res) => {
    try{
        console.log(`REGISTERING....`)

        const email = req.body.email;
        const password = req.body.password;
        const message = req.body.message;

        const user = await User.findOne({ email: req.body.email });
        
        if (user) {
            res.render('register', { errors: { email: { message: 'Email already exists!' } } })
            return;
        }

        await User.create({
            email: email,
            password: password
        })

        res.render('home', {message: "USER HAS BEEN CREATED YOU CAN NOW LOGIN", trackers: [], totalHours: 0, jobs: [] })
    } catch (e){
        console.log(e)
        if (e.errors) {
            res.render('register', { errors: e.errors })
            return;
        }
        return res.status(400).send({
            message: JSON.parse(e),
        });
    }
}

exports.login = async (req, res) => {
    try {
        const message = req.query.message;

        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            res.render("login", { errors: { email: { message: "Email not Found" }}})
            return;
        }

        const match = await bcrypt.compare(req.body.password, user.password);

        if (match) {
            req.session.userID = user._id;
            console.log(`User authenticated! - ${req.session.userID}`);
            res.redirect('/');
            return;
        }
        
        res.render("login", { errors: { password: { message: "Password Incorrect" }}})
    } catch(e) {
        return res.status(400).send({
            message: JSON.parse(e),
        });
    }
}