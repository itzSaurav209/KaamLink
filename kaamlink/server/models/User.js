// File: server/models/User.js
// Purpose: Mongoose model for application users with auth and OTP fields

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        lowercase: true,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
        sparse: true,
    },
    passwordHash: {
        type: String,
    },
    role: {
        type: String,
        enum: ['worker', 'employer', 'admin'],
        default: 'employer',
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    isPhoneVerified: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String,
    },
    otpExpiry: {
        type: Date,
    },
    profilePic: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);