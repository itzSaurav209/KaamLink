// File: server/utils/mockOtp.js
// Purpose: Mock OTP generation and verification helpers using User model

const User = require('../models/User');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const storeOTP = async (userId, otp) => {
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  await User.findByIdAndUpdate(userId, { otp, otpExpiry: expiry });
};

const verifyOTP = async (userId, inputOtp) => {
  const user = await User.findById(userId);
  if (!user || !user.otp || !user.otpExpiry) return false;
  if (user.otp !== inputOtp) return false;
  if (user.otpExpiry < new Date()) return false;

  user.isPhoneVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  return true;
};

module.exports = { generateOTP, storeOTP, verifyOTP };

