// File: server/routes/jobRoutes.js
// Purpose: Routes for job creation and lifecycle actions

const express = require('express');
const {
  createJob,
  getEmployerJobs,
  getAvailableJobs,
  getJobById,
  acceptJob,
  startJob,
  completeJob,
  cancelJob,
} = require('../controllers/jobController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', verifyToken, requireRole('employer'), createJob);
router.get('/my-jobs', verifyToken, requireRole('employer'), getEmployerJobs);
router.get('/available', verifyToken, requireRole('worker'), getAvailableJobs);
router.get('/:id', verifyToken, getJobById);
router.put('/:id/accept', verifyToken, requireRole('worker'), acceptJob);
router.put('/:id/start', verifyToken, requireRole('worker'), startJob);
router.put('/:id/complete', verifyToken, requireRole('worker'), completeJob);
router.put('/:id/cancel', verifyToken, cancelJob);

module.exports = router;

