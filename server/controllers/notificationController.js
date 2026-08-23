const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markRead = async (req, res) => {
  try {
    await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { read: true });
    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    res.json({ message: 'All marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const notification = await Notification.create({ user: req.user._id, ...req.body });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.seedDefaultNotifications = async (req, res) => {
  try {
    const existing = await Notification.countDocuments({ user: req.user._id });
    if (existing > 0) return res.json({ message: 'Notifications already exist' });

    const defaults = [
      { type: 'reminder', title: 'Daily Interview Practice', message: 'Complete at least one mock interview today to maintain your streak!', link: '/mock-interview' },
      { type: 'progress', title: 'Weekly Progress Report', message: 'Check your learning dashboard for this week\'s progress summary.', link: '/dashboard' },
      { type: 'contest', title: 'Upcoming Coding Contest', message: 'Join this weekend\'s coding challenge and test your skills!', link: '/coding' },
      { type: 'study-plan', title: 'Personalized Study Plan', message: 'Your AI-generated study plan is ready based on weak topics.', link: '/dashboard' },
    ];

    await Notification.insertMany(defaults.map((n) => ({ ...n, user: req.user._id })));
    res.status(201).json({ message: 'Default notifications created' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
