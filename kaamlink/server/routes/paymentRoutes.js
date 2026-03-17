// File: server/routes/paymentRoutes.js
// Purpose: Routes for mock payment initiation, confirmation, and retrieval

const express = require('express');
const {
  initiatePayment,
  confirmPayment,
  getPaymentByJob,
} = require('../controllers/paymentController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/initiate', verifyToken, requireRole('employer'), initiatePayment);
router.post('/confirm', verifyToken, requireRole('employer'), confirmPayment);
router.get('/job/:jobId', verifyToken, getPaymentByJob);

module.exports = router;

