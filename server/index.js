require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resume');
const interviewRoutes = require('./routes/interview');
const codingRoutes = require('./routes/coding');
const dashboardRoutes = require('./routes/dashboard');
const adminRoutes = require('./routes/admin');
const notificationRoutes = require('./routes/notifications');
const chatRoutes = require('./routes/chat');
const companyRoutes = require('./routes/company');

connectDB();

if (!process.env.GEMINI_API_KEY?.trim()) {
  console.warn('Warning: GEMINI_API_KEY is not set. AI features (resume analysis, mock interview, chat) will not work.');
  console.warn('Get a free key at https://aistudio.google.com/app/apikey and add it to server/.env');
}

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/companies', companyRoutes);

app.use((err, _req, res, _next) => {
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
