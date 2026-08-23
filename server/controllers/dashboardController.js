const User = require('../models/User');
const InterviewSession = require('../models/InterviewSession');
const { Submission } = require('../models/CodingChallenge');
const ResumeAnalysis = require('../models/ResumeAnalysis');

exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const sessions = await InterviewSession.find({ user: req.user._id });
    const submissions = await Submission.find({ user: req.user._id });
    const analyses = await ResumeAnalysis.find({ user: req.user._id });

    const mockScores = sessions.filter((s) => s.type === 'mock' && s.overallScore).map((s) => s.overallScore);
    const codingScores = submissions.map((s) => s.score).filter(Boolean);
    const atsScores = analyses.map((a) => a.atsScore).filter(Boolean);

    const topicWeakness = {};
    sessions.forEach((s) => {
      s.questions.forEach((q) => {
        if (q.scores?.overall && q.scores.overall < 60 && q.topic) {
          topicWeakness[q.topic] = (topicWeakness[q.topic] || 0) + 1;
        }
      });
    });

    const weakTopics = Object.entries(topicWeakness)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }));

    const avgMock = mockScores.length ? Math.round(mockScores.reduce((a, b) => a + b, 0) / mockScores.length) : 0;
    const avgCoding = codingScores.length ? Math.round(codingScores.reduce((a, b) => a + b, 0) / codingScores.length) : 0;
    const avgAts = atsScores.length ? Math.round(atsScores.reduce((a, b) => a + b, 0) / atsScores.length) : 0;
    const readiness = Math.round((avgMock * 0.4 + avgCoding * 0.35 + avgAts * 0.25) || user.interviewReadiness);

    if (readiness !== user.interviewReadiness) {
      user.interviewReadiness = readiness;
      await user.save();
    }

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    const activityByDay = last7Days.map((date) => ({
      date,
      sessions: sessions.filter((s) => s.createdAt.toISOString().startsWith(date)).length,
      submissions: submissions.filter((s) => s.createdAt.toISOString().startsWith(date)).length,
    }));

    res.json({
      streak: user.streak,
      interviewReadiness: readiness,
      stats: {
        totalSessions: sessions.length,
        totalSubmissions: submissions.length,
        totalAnalyses: analyses.length,
        avgMockScore: avgMock,
        avgCodingScore: avgCoding,
        avgAtsScore: avgAts,
      },
      weakTopics,
      activityByDay,
      recommendedResources: weakTopics.map((t) => ({
        topic: t.topic,
        resources: [
          `https://leetcode.com/tag/${t.topic.toLowerCase().replace(/\s+/g, '-')}/`,
          `https://www.geeksforgeeks.org/?s=${encodeURIComponent(t.topic)}`,
        ],
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
