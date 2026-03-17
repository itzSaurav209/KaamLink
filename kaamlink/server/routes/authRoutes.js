// File: server/routes/authRoutes.js
// Purpose: Express router for authentication and OTP-related endpoints

const express = require('express');
const { body } = require('express-validator');
const {
  register,
  sendOtp,
  verifyOtp,
  login,
  logout,
  getMe,
} = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('email').optional().isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  ],
  register
);

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

router.post('/logout', verifyToken, logout);
router.get('/me', verifyToken, getMe);

module.exports = router;

