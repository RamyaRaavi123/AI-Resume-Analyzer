const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    logo: String,
    description: String,
    interviewExperiences: [
      {
        role: String,
        experience: String,
        rating: Number,
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    faqs: [{ question: String, answer: String, category: String }],
    codingProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CodingChallenge' }],
    hrQuestions: [String],
    systemDesignQuestions: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);
