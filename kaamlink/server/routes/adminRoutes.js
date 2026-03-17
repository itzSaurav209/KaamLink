// File: server/routes/adminRoutes.js
// Purpose: Admin-only routes for workers, users, jobs, and stats

const express = require('express');
const {
  getPendingWorkers,
  approveWorker,
  rejectWorker,
  getAllUsers,
  deleteUser,
  getAllJobs,
  getStats,
} = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken, requireRole('admin'));

router.get('/workers/pending', getPendingWorkers);
router.put('/workers/:id/approve', approveWorker);
router.put('/workers/:id/reject', rejectWorker);

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

router.get('/jobs', getAllJobs);

router.get('/stats', getStats);

module.exports = router;

