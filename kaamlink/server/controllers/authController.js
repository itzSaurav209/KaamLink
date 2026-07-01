// File: server/controllers/authController.js
// Purpose: Handles user registration, OTP, login, and current user retrieval

const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const WorkerProfile = require('../models/WorkerProfile');
const generateToken = require('../utils/generateToken');
const { generateOTP, storeOTP, verifyOTP } = require('../utils/mockOtp');

const normalizePhone = (value) => {
    if (!value) return '';
    return value.toString().trim();
};

// Helper to send validation errors in a consistent format
const handleValidation = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    return null;
};

// POST /api/auth/register
const register = async(req, res) => {
    const validationError = handleValidation(req, res);
    if (validationError) return;

    try {
        const { name, email, phone, password, role } = req.body;
        const normalizedEmail = email ? email.toLowerCase().trim() : '';
        const normalizedPhone = normalizePhone(phone);

        if (!normalizedEmail) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const existingQuery = [];
        if (normalizedEmail) existingQuery.push({ email: normalizedEmail });
        if (normalizedPhone) existingQuery.push({ phone: normalizedPhone });

        const existing = existingQuery.length ? await User.findOne({ $or: existingQuery }) : null;
        if (existing) {
            return res.status(400).json({ message: 'User with this email or phone already exists' });
        }

        const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;

        const user = await User.create({
            name,
            email: normalizedEmail,
            ...(normalizedPhone ? { phone: normalizedPhone } : {}),
            passwordHash,
            role: role || 'employer',
            isPhoneVerified: Boolean(normalizedPhone ? false : true),
        });

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
                isEmailVerified: user.isEmailVerified,
                isPhoneVerified: user.isPhoneVerified,
            },
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Registration failed' });
    }
};

// POST /api/auth/send-otp
const sendOtp = async(req, res) => {
    try {
        const { email } = req.body;
        const normalizedEmail = email ? email.toLowerCase().trim() : '';

        if (!normalizedEmail) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found for provided email' });
        }

        const otp = generateOTP();
        await storeOTP(user._id, otp);

        console.log(`📧 Mock OTP for ${normalizedEmail}: ${otp}`);

        res.json({ message: 'OTP sent successfully (mock)', email: normalizedEmail });
    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
};

// POST /api/auth/verify-otp
const verifyOtpController = async(req, res) => {
    try {
        const { email, otp } = req.body;
        const normalizedEmail = email ? email.toLowerCase().trim() : '';

        if (!normalizedEmail || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const ok = await verifyOTP(user._id, otp);
        if (!ok) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ message: 'Failed to verify OTP' });
    }
};

// POST /api/auth/verify-phone
const verifyPhone = async(req, res) => {
    try {
        const { phone, firebaseUid } = req.body;
        const normalizedPhone = normalizePhone(phone);

        if (!normalizedPhone) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.phone = normalizedPhone;
        user.isPhoneVerified = true;
        if (firebaseUid) {
            user.firebaseUid = firebaseUid;
        }
        await user.save();

        res.json({
            message: 'Phone verified successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
                isPhoneVerified: user.isPhoneVerified,
            },
        });
    } catch (error) {
        console.error('Verify phone error:', error);
        res.status(500).json({ message: 'Failed to verify phone' });
    }
};

// POST /api/auth/login
const login = async(req, res) => {
    const validationError = handleValidation(req, res);
    if (validationError) return;

    try {
        const { email, password } = req.body;
        const normalizedEmail = email ? email.toLowerCase().trim() : '';
        const user = await User.findOne({ email: normalizedEmail });
        if (!user || !user.passwordHash) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.isPhoneVerified) {
            return res.status(403).json({
                message: 'Phone verification required before login',
                requiresPhoneVerification: true,
            });
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
                isEmailVerified: user.isEmailVerified,
                isPhoneVerified: user.isPhoneVerified,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
};

// POST /api/auth/logout
const logout = async(req, res) => {
    res.json({ message: 'Logged out successfully' });
};

// GET /api/auth/me
const getMe = async(req, res) => {
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
    verifyPhone,
    login,
    logout,
    getMe,
};