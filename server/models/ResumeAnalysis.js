const mongoose = require('mongoose');

const resumeAnalysisSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileName: String,
    resumeText: String,
    targetRole: String,
    atsScore: Number,
    skillGaps: [String],
    keywords: {
      present: [String],
      missing: [String],
    },
    suggestions: [String],
    recommendedRoles: [String],
    strengths: [String],
    summary: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
