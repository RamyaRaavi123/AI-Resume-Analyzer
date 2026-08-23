const express = require('express');
const { analyze, getHistory, getById } = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();
router.post('/analyze', protect, upload.single('resume'), analyze);
router.get('/history', protect, getHistory);
router.get('/:id', protect, getById);

module.exports = router;
