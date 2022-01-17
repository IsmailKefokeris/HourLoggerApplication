const mongoose = require("mongoose");
const { double, long } = require("webidl-conversions");
const { Schema } = mongoose;

const trackerSchema = new Schema(
    {
        date: {type: Date, required: [true, "Date Required"]},
        startTime: {type: String, required: [true, "Start Time Required"]},
        endTime: {type: String, required: [true, "End Time Required"]},
        job: {type: String, required: [true, "Job Required"]},
        user: {type: String, required: true}
    },
    { timestamps: true }
);

module.exports = mongoose.model("Tracker", trackerSchema);
