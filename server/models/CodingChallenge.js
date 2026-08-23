const mongoose = require('mongoose');

const codingChallengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    languages: [String],
    timeLimit: { type: Number, default: 30 },
    testCases: [
      {
        input: String,
        expectedOutput: String,
        isHidden: { type: Boolean, default: false },
      },
    ],
    company: String,
    topic: String,
  },
  { timestamps: true }
);

const submissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'CodingChallenge', required: true },
    code: String,
    language: String,
    score: Number,
    passed: Boolean,
    timeComplexity: String,
    spaceComplexity: String,
    feedback: String,
  },
  { timestamps: true }
);

module.exports = {
  CodingChallenge: mongoose.model('CodingChallenge', codingChallengeSchema),
  Submission: mongoose.model('Submission', submissionSchema),
};
