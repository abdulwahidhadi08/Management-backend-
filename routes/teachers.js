const express = require('express');
const router = express.Router();
const { getTeachers, getTeacherById, createTeacher, updateTeacher, deleteTeacher } = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', authorize('admin', 'headmaster'), getTeachers);
router.get('/:id', authorize('admin', 'headmaster'), getTeacherById);
router.post('/', authorize('admin'), createTeacher);
router.put('/:id', authorize('admin'), updateTeacher);
router.delete('/:id', authorize('admin'), deleteTeacher);

module.exports = router;
