const express = require('express');
const {
  generatePrep,
  startMockInterview,
  submitAnswer,
  getSessions,
  saveSession,
} = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.post('/prep', protect, generatePrep);
router.post('/mock', protect, startMockInterview);
router.post('/answer', protect, submitAnswer);
router.get('/sessions', protect, getSessions);
router.post('/save/:id', protect, saveSession);

module.exports = router;
