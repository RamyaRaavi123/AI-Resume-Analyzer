const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['reminder', 'progress', 'contest', 'study-plan', 'system'], default: 'system' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    link: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
