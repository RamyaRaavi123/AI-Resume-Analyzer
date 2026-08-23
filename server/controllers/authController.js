const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const today = new Date().toDateString();
    const lastActive = user.lastActiveDate?.toDateString();
    if (lastActive === today) {
      // same day, no streak change
    } else if (lastActive === new Date(Date.now() - 86400000).toDateString()) {
      user.streak += 1;
    } else {
      user.streak = 1;
    }
    user.lastActiveDate = new Date();
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      streak: user.streak,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  res.json(req.user);
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const fields = ['name', 'skills', 'interests', 'targetRole', 'targetCompanies', 'avatar'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) user[f] = req.body[f];
    });

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSavedSessions = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedSessions');
    res.json(user.savedSessions || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
