// File: server/middleware/authMiddleware.js
// Purpose: Authentication and role-based authorization middleware for API routes

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const allowUnverifiedPaths = ['/me', '/logout', '/verify-phone'];

const requirePhoneVerification = (req, res, next) => {
    if (!req.user || !req.user.isPhoneVerified) {
        return res.status(403).json({
            message: 'Phone verification required before using protected routes',
            requiresPhoneVerification: true,
        });
    }
    next();
};

// Verifies JWT from Authorization header and attaches user to request
const verifyToken = async(req, res, next) => {
    try {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ') ?
            authHeader.split(' ')[1] :
            null;

        if (!token) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-passwordHash -otp -otpExpiry');
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;

        if (!user.isPhoneVerified && !allowUnverifiedPaths.includes(req.path)) {
            return res.status(403).json({
                message: 'Phone verification required before using protected routes',
                requiresPhoneVerification: true,
            });
        }

        next();
    } catch (error) {
        console.error('Auth error:', error.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Ensures the authenticated user has at least one of the required roles
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
        }
        next();
    };
};

module.exports = { verifyToken, requirePhoneVerification, requireRole };