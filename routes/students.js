const express = require('express');
const router = express.Router();
const { getStudents, getStudentById, createStudent, updateStudent, deleteStudent } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', authorize('admin', 'headmaster'), getStudents);
router.get('/:id', authorize('admin', 'headmaster'), getStudentById);
router.post('/', authorize('admin'), createStudent);
router.put('/:id', authorize('admin', 'headmaster'), updateStudent);
router.delete('/:id', authorize('admin'), deleteStudent);

module.exports = router;
