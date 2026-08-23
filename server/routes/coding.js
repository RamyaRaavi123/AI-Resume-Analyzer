const express = require('express');
const {
  getChallenges,
  getChallenge,
  submitSolution,
  getHint,
  getSubmissions,
} = require('../controllers/codingController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.get('/', protect, getChallenges);
router.get('/submissions', protect, getSubmissions);
router.get('/:id', protect, getChallenge);
router.post('/:id/submit', protect, submitSolution);
router.post('/:id/hint', protect, getHint);

module.exports = router;
