const express = require('express');
const router = express.Router();
const { getAttendanceSheet, saveAttendance, getStudentAttendance } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', authorize('admin', 'headmaster'), getAttendanceSheet);
router.post('/', authorize('admin', 'headmaster'), saveAttendance);
router.get('/student/:studentId', getStudentAttendance);

module.exports = router;
