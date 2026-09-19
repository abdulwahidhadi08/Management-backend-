const express = require('express');
const router = express.Router();
const { getEvents, getEventById, createEvent, updateEvent, deleteEvent, registerStudent } = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

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

router.get('/', optionalProtect, getEvents);
router.get('/:id', optionalProtect, getEventById);

router.post('/', protect, authorize('admin', 'headmaster'), createEvent);
router.put('/:id', protect, authorize('admin', 'headmaster'), updateEvent);
router.delete('/:id', protect, authorize('admin', 'headmaster'), deleteEvent);

router.post('/:id/register', protect, registerStudent);

module.exports = router;
