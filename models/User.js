const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    lastname: {
        type: String,
        required: true,
        min: 3,
        max: 20,
    },
    firstname: {
        type: String,
        required: true,
        min: 3,
        max: 20,
    },
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    profilePicture: {
        type: String,
        default: ""
    },
    termsCgu: {
        type: Boolean,
        required: true,
    },
    otp: {
        type: String,
        required: true,
        // min: 6,
        // unique: true
    },
    userType: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

const User = mongoose.model("User", userSchema)

exports.userSchema = userSchema;
exports.User = User; 