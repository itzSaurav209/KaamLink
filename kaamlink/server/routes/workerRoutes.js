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

// Protected profile routes FIRST
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

// Public routes LAST
router.get('/', searchWorkers);
router.get('/:id', getWorkerById);

module.exports = router;