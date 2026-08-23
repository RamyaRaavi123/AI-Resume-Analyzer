const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    category: { type: String, enum: ['technical', 'hr', 'behavioral', 'system-design', 'coding'], required: true },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
    question: { type: String, required: true },
    answer: String,
    topic: String,
    company: String,
    role: String,
    isApproved: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
