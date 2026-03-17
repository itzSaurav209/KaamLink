// File: server/controllers/authController.js
// Purpose: Handles user registration, OTP, login, and current user retrieval

const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const WorkerProfile = require('../models/WorkerProfile');
const generateToken = require('../utils/generateToken');
const { generateOTP, storeOTP, verifyOTP } = require('../utils/mockOtp');

// Helper to send validation errors in a consistent format
const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return null;
};

// POST /api/auth/register
const register = async (req, res) => {
  const validationError = handleValidation(req, res);
  if (validationError) return;

  try {
    const { name, email, phone, password, role } = req.body;

    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      return res.status(400).json({ message: 'User with email or phone already exists' });
    }

    const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;

    const user = await User.create({
      name,
      email,
      phone,
      passwordHash,
      role: role || 'employer',
    });

    // Automatically create empty worker profile stub if registering as worker
    if (user.role === 'worker') {
      await WorkerProfile.create({
        user: user._id,
        category: 'other',
        availability: 'available',
      });
    }

    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isPhoneVerified: user.isPhoneVerified,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

// POST /api/auth/send-otp
const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: 'Phone is required' });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found for provided phone' });
    }

    const otp = generateOTP();
    await storeOTP(user._id, otp);

    // For hackathon/demo, just log the OTP instead of sending SMS
    console.log(`📲 Mock OTP for ${phone}: ${otp}`);

    res.json({ message: 'OTP sent successfully (mock)', phone });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// POST /api/auth/verify-otp
const verifyOtpController = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ message: 'Phone and OTP are required' });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const ok = await verifyOTP(user._id, otp);
    if (!ok) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    res.json({ message: 'Phone verified successfully' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const validationError = handleValidation(req, res);
  if (validationError) return;

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isPhoneVerified: user.isPhoneVerified,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

// POST /api/auth/logout
const logout = async (req, res) => {
  // With JWTs on the client, logout is client-driven; this endpoint exists for symmetry
  res.json({ message: 'Logged out successfully' });
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash -otp -otpExpiry');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ message: 'Failed to load user' });
  }
};

module.exports = {
  register,
  sendOtp,
  verifyOtp: verifyOtpController,
  login,
  logout,
  getMe,
};

