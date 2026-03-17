// File: server/routes/workerRoutes.js
// Purpose: Routes for worker profile management, search, and document uploads

const express = require('express');
const {
  createProfile,
  getMyProfile,
  updateProfile,
  searchWorkers,
  getWorkerById,
  uploadDocuments,
} = require('../controllers/workerController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', searchWorkers);
router.get('/:id', getWorkerById);

router.post('/profile', verifyToken, requireRole('worker'), createProfile);
router.get('/profile/me', verifyToken, requireRole('worker'), getMyProfile);
router.put('/profile', verifyToken, requireRole('worker'), updateProfile);

router.post(
  '/documents',
  verifyToken,
  requireRole('worker'),
  upload.array('documents', 5),
  uploadDocuments
);

module.exports = router;

