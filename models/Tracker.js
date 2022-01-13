const mongoose = require("mongoose");
const { double, long } = require("webidl-conversions");
const { Schema } = mongoose;

const trackerSchema = new Schema(
    {
        date: {type: String, required: [true, "Date Required"]},
        startTime: {type: double, required: [true, "Start Time Required"]},
        endTime: {type: double, required: [true, "End Time Required"]},
        job: {type: String, required: [true, "Job Required"]},        
    },
    { timestamps: true }
);

module.exports = mongoose.model("Tracker", trackerSchema);
