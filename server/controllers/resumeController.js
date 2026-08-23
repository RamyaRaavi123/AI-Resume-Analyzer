const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const WordExtractor = require('word-extractor');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const { analyzeResume } = require('../services/aiService');

const isReadableText = (text) => {
  const cleaned = text.replace(/\s/g, '');
  if (cleaned.length < 50) return false;
  const printable = cleaned.replace(/[\x20-\x7E\u00A0-\u024F]/g, '');
  return printable.length / cleaned.length < 0.3;
};

const extractText = async (filePath, mimetype, originalname) => {
  const ext = path.extname(originalname || filePath).toLowerCase();
  const buffer = fs.readFileSync(filePath);

  if (mimetype === 'application/pdf' || ext === '.pdf') {
    const data = await pdfParse(buffer);
    return data.text.trim();
  }

  if (
    ext === '.docx' ||
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  }

  if (ext === '.doc' || mimetype === 'application/msword') {
    const extractor = new WordExtractor();
    const doc = await extractor.extract(filePath);
    return doc.getBody().trim();
  }

  if (ext === '.txt' || mimetype === 'text/plain') {
    return buffer.toString('utf-8').trim();
  }

  throw new Error('Unsupported file format. Please upload PDF, DOC, DOCX, or TXT.');
};

exports.analyze = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Resume file required' });
    }

    const { targetRole } = req.body;
    const resumeText = await extractText(req.file.path, req.file.mimetype, req.file.originalname);

    if (!isReadableText(resumeText)) {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({
        message: 'Could not read text from this file. Try saving as PDF or DOCX and upload again.',
      });
    }

    const analysis = await analyzeResume(resumeText, targetRole);

    const saved = await ResumeAnalysis.create({
      user: req.user._id,
      fileName: req.file.originalname,
      resumeText: resumeText.slice(0, 5000),
      targetRole,
      ...analysis,
    });

    fs.unlink(req.file.path, () => {});
    res.status(201).json(saved);
  } catch (error) {
    if (req.file?.path) fs.unlink(req.file.path, () => {});
    res.status(500).json({ message: error.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const analyses = await ResumeAnalysis.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20);
    res.json(analyses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findOne({ _id: req.params.id, user: req.user._id });
    if (!analysis) return res.status(404).json({ message: 'Analysis not found' });
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
