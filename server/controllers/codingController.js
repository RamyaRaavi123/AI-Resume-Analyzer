const { CodingChallenge, Submission } = require('../models/CodingChallenge');
const { getCodingHint, evaluateCode } = require('../services/aiService');

exports.getChallenges = async (req, res) => {
  try {
    const filter = {};
    if (req.query.difficulty) filter.difficulty = req.query.difficulty;
    if (req.query.company) filter.company = req.query.company;

    const challenges = await CodingChallenge.find(filter).select('-testCases.isHidden');
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getChallenge = async (req, res) => {
  try {
    const challenge = await CodingChallenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

    const publicCases = challenge.testCases.filter((tc) => !tc.isHidden);
    res.json({ ...challenge.toObject(), testCases: publicCases });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitSolution = async (req, res) => {
  try {
    const { code, language } = req.body;
    const challenge = await CodingChallenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

    const evaluation = await evaluateCode(challenge.description, code, language);
    const submission = await Submission.create({
      user: req.user._id,
      challenge: challenge._id,
      code,
      language,
      ...evaluation,
    });

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getHint = async (req, res) => {
  try {
    const { code, language } = req.body;
    const challenge = await CodingChallenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

    const hint = await getCodingHint(challenge.description, code, language);
    res.json({ hint });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user._id })
      .populate('challenge', 'title difficulty')
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
