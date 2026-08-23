const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['prep', 'mock'], default: 'prep' },
    role: String,
    company: String,
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
    questions: [
      {
        question: String,
        topic: String,
        tips: String,
        answer: String,
        scores: {
          communication: Number,
          confidence: Number,
          technical: Number,
          overall: Number,
        },
        feedback: String,
      },
    ],
    roadmap: [
      {
        topic: String,
        priority: String,
        resources: [String],
      },
    ],
    overallScore: Number,
    status: { type: String, enum: ['active', 'completed'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
