const Company = require('../models/Company');
const Question = require('../models/Question');
const { CodingChallenge } = require('../models/CodingChallenge');

exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().select('name logo description');
    if (companies.length === 0) {
      const defaults = [
        { name: 'Google', description: 'Tech giant known for algorithm-heavy interviews' },
        { name: 'Amazon', description: 'Leadership principles and system design focus' },
        { name: 'Microsoft', description: 'Balanced technical and behavioral rounds' },
        { name: 'Meta', description: 'Product sense and coding intensive' },
        { name: 'Apple', description: 'Deep technical and culture fit interviews' },
      ];
      await Company.insertMany(defaults);
      return res.json(await Company.find().select('name logo description'));
    }
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCompany = async (req, res) => {
  try {
    let company = await Company.findOne({ name: new RegExp(`^${req.params.name}$`, 'i') });
    if (!company) return res.status(404).json({ message: 'Company not found' });

    const faqs = await Question.find({ company: company.name, isApproved: true }).limit(20);
    const coding = await CodingChallenge.find({ company: company.name }).limit(10);

    res.json({ ...company.toObject(), faqsFromBank: faqs, codingProblems: coding });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addExperience = async (req, res) => {
  try {
    const company = await Company.findOne({ name: new RegExp(`^${req.params.name}$`, 'i') });
    if (!company) return res.status(404).json({ message: 'Company not found' });

    company.interviewExperiences.push({ ...req.body, postedBy: req.user._id });
    await company.save();
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
