const User = require('../models/User');
const Question = require('../models/Question');
const { CodingChallenge } = require('../models/CodingChallenge');
const InterviewSession = require('../models/InterviewSession');
const ResumeAnalysis = require('../models/ResumeAnalysis');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createQuestion = async (req, res) => {
  try {
    const question = await Question.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.moderateContent = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, { isApproved: req.body.isApproved }, { new: true });
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const [users, sessions, submissions, analyses, challenges] = await Promise.all([
      User.countDocuments(),
      InterviewSession.countDocuments(),
      require('../models/CodingChallenge').Submission.countDocuments(),
      ResumeAnalysis.countDocuments(),
      CodingChallenge.countDocuments(),
    ]);

    res.json({ users, sessions, submissions, analyses, challenges });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createChallenge = async (req, res) => {
  try {
    const challenge = await CodingChallenge.create(req.body);
    res.status(201).json(challenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
