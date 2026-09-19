const express = require('express');
const router = express.Router();
const { getClasses, getClassById, createClass, updateClass, deleteClass } = require('../controllers/classController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', authorize('admin', 'headmaster'), getClasses);
router.get('/:id', authorize('admin', 'headmaster'), getClassById);
router.post('/', authorize('admin'), createClass);
router.put('/:id', authorize('admin'), updateClass);
router.delete('/:id', authorize('admin'), deleteClass);

module.exports = router;
