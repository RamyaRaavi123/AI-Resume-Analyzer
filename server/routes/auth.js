const express = require('express');
const { register, login, getProfile, updateProfile, getSavedSessions } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/saved-sessions', protect, getSavedSessions);

module.exports = router;
