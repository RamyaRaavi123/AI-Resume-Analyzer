const InterviewSession = require('../models/InterviewSession');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const User = require('../models/User');
const { generateInterviewQuestions, evaluateMockAnswer } = require('../services/aiService');

exports.generatePrep = async (req, res) => {
  try {
    const { role, difficulty = 'intermediate', company } = req.body;
    const latestResume = await ResumeAnalysis.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    const resumeText = latestResume?.resumeText || req.body.resumeText || '';

    const result = await generateInterviewQuestions(resumeText, role, difficulty, company);
    const session = await InterviewSession.create({
      user: req.user._id,
      type: 'prep',
      role,
      company,
      difficulty,
      questions: result.questions,
      roadmap: result.roadmap,
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.startMockInterview = async (req, res) => {
  try {
    const { role, difficulty = 'intermediate', company } = req.body;
    const latestResume = await ResumeAnalysis.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    const result = await generateInterviewQuestions(latestResume?.resumeText || '', role, difficulty, company);

    const session = await InterviewSession.create({
      user: req.user._id,
      type: 'mock',
      role,
      company,
      difficulty,
      questions: result.questions.map((q) => ({ ...q, answer: '', feedback: '' })),
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitAnswer = async (req, res) => {
  try {
    const { sessionId, questionIndex, answer } = req.body;
    const session = await InterviewSession.findOne({ _id: sessionId, user: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const question = session.questions[questionIndex];
    if (!question) return res.status(400).json({ message: 'Invalid question index' });

    const evaluation = await evaluateMockAnswer(question.question, answer, session.role);
    session.questions[questionIndex].answer = answer;
    session.questions[questionIndex].scores = {
      communication: evaluation.communicationScore,
      confidence: evaluation.confidenceScore,
      technical: evaluation.technicalScore,
      overall: evaluation.overallScore,
    };
    session.questions[questionIndex].feedback = evaluation.feedback;

    if (evaluation.followUpQuestion && questionIndex === session.questions.length - 1) {
      session.questions.push({
        question: evaluation.followUpQuestion,
        topic: 'Follow-up',
        tips: '',
        answer: '',
        feedback: '',
      });
    }

    const scored = session.questions.filter((q) => q.scores?.overall);
    if (scored.length) {
      session.overallScore = Math.round(scored.reduce((s, q) => s + q.scores.overall, 0) / scored.length);
    }

    if (questionIndex === session.questions.length - 1 && !evaluation.followUpQuestion) {
      session.status = 'completed';
    }

    await session.save();
    res.json({ session, evaluation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.saveSession = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { savedSessions: req.params.id } });
    res.json({ message: 'Session saved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
