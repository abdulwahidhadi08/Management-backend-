const express = require('express');
const router = express.Router();
const { getAnnouncements, getAnnouncementById, createAnnouncement, updateAnnouncement, deleteAnnouncement } = require('../controllers/announcementController');
const { protect, authorize } = require('../middleware/auth');

// Optional auth helper to check user role if logged in
const optionalProtect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const jwt = require('jsonwebtoken');
      const User = require('../models/User');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      console.warn('Optional auth token invalid');
    }
  }
  next();
};

router.get('/', optionalProtect, getAnnouncements);
router.get('/:id', optionalProtect, getAnnouncementById);

router.post('/', protect, authorize('admin', 'headmaster'), createAnnouncement);
router.put('/:id', protect, authorize('admin', 'headmaster'), updateAnnouncement);
router.delete('/:id', protect, authorize('admin', 'headmaster'), deleteAnnouncement);

module.exports = router;
