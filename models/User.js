const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: [ true, "Email is required" ],
            unique: true},
        password: {
            type: String,
            required: [ true, "Password is required" ]}
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function (next) {
    // Logging
    console.log(`Password unencrypted: ${this.password}`);

    try {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
        next();
    } catch (e) {
        throw Error("Could not Hash Password!!");
    }
})

module.exports = mongoose.model("User", userSchema);
