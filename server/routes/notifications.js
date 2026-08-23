const express = require('express');
const {
  getNotifications,
  markRead,
  markAllRead,
  createNotification,
  seedDefaultNotifications,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.get('/', protect, getNotifications);
router.post('/seed', protect, seedDefaultNotifications);
router.post('/', protect, createNotification);
router.patch('/read-all', protect, markAllRead);
router.patch('/:id/read', protect, markRead);

module.exports = router;
