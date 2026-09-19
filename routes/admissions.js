const express = require('express');
const router = express.Router();
const { getAdmissions, getAdmissionById, createAdmissionApplication, updateAdmissionStatus } = require('../controllers/admissionController');
const { protect, authorize } = require('../middleware/auth');

// Public route to apply
router.post('/apply', createAdmissionApplication);

// Protected routes to manage applications
router.get('/', protect, authorize('admin', 'headmaster'), getAdmissions);
router.get('/:id', protect, authorize('admin', 'headmaster'), getAdmissionById);
router.put('/:id/status', protect, authorize('admin', 'headmaster'), updateAdmissionStatus);

module.exports = router;
