const express = require('express');
const router = express.Router();
const { getSchoolContent, updateSchoolContent, getSchoolStats } = require('../controllers/contentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getSchoolContent);
router.get('/stats', getSchoolStats);
router.put('/', protect, authorize('admin', 'headmaster'), updateSchoolContent);

module.exports = router;
