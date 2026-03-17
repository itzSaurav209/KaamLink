// File: server/routes/reviewRoutes.js
// Purpose: Routes for creating and fetching reviews

const express = require('express');
const {
  submitReview,
  getWorkerReviews,
  getEmployerReviews,
} = require('../controllers/reviewController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', verifyToken, submitReview);
router.get('/worker/:workerId', getWorkerReviews);
router.get('/employer/:empId', getEmployerReviews);

module.exports = router;

