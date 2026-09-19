const express = require('express');
const router = express.Router();
const { addResult, getStudentResults, deleteResult } = require('../controllers/recordController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', authorize('admin'), addResult);
router.get('/student/:studentId', getStudentResults);
router.delete('/:id', authorize('admin'), deleteResult);

module.exports = router;
