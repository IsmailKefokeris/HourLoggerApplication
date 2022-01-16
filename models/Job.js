const { Double } = require("mongodb");
const mongoose = require("mongoose");
const { double, long } = require("webidl-conversions");
const { Schema } = mongoose;

const jobSchema = new Schema(
    {
        name: {type: String, required: [true, "Job Title/Name Required"]},
        rate: {type: Number, required: [true, "Job Hourly Rate Required"]},
        user: {type: String, required: true}
    },
    { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
