# InterviewAI — AI Interview Preparation Platform

Full-stack interview preparation platform with resume analysis, mock interviews, coding assessments, and personalized learning — powered by **React**, **Node.js**, **MongoDB**, and **Gemini AI**.

## Features

| Module | Capabilities |
|--------|-------------|
| **Resume Analyzer** | ATS score, skill gaps, keyword optimization, improvement suggestions, role recommendations |
| **Interview Prep** | Personalized questions by role, difficulty (Beginner/Intermediate/Advanced), company-specific sets, topic roadmap |
| **Mock Interview** | Voice input, follow-up questions, communication/confidence/technical scoring, AI feedback |
| **Coding Assessment** | Timed challenges, multi-language editor, hidden test cases, complexity analysis, AI hints |
| **Learning Dashboard** | Study streaks, progress charts, weak-topic detection, resource recommendations, readiness score |
| **User Profile** | JWT auth, skills/interests, target companies, saved sessions |
| **Admin Panel** | User management, question banks, analytics, content moderation |
| **Notifications** | Daily reminders, weekly reports, contest alerts, study plans |
| **AI Chat** | Concept explanations, learning plans, code review |
| **Company Prep** | Interview experiences, FAQs, company coding problems, HR & system design questions |

## Tech Stack

- **Frontend:** React, Tailwind CSS, Redux Toolkit, React Router, Chart.js
- **Backend:** Node.js, Express, JWT, Multer, REST APIs
- **Database:** MongoDB, Mongoose
- **AI:** Google Gemini API

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

## Setup

### 1. Clone and install

```bash
cd "AI Resume Analyzer"

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure environment

```bash
cd ../server
copy .env.example .env   # Windows
# cp .env.example .env   # macOS/Linux
```

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/interview-prep
JWT_SECRET=your_secure_secret_here
JWT_EXPIRE=7d
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

### 3. Seed sample data (optional)

```bash
cd server
npm run seed
```

### 4. Run the app

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

Open **http://localhost:5173** and register an account.

### Admin access

After registering, set a user's role to `admin` in MongoDB:

```js
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

## API Routes

| Prefix | Description |
|--------|-------------|
| `/api/auth` | Register, login, profile |
| `/api/resume` | Upload & analyze resume |
| `/api/interview` | Prep questions, mock interviews |
| `/api/coding` | Challenges, submissions, hints |
| `/api/dashboard` | Stats, streaks, readiness |
| `/api/admin` | Users, questions, analytics |
| `/api/notifications` | Alerts & reminders |
| `/api/chat` | AI assistant |
| `/api/companies` | Company-specific prep |

## Project Structure

```
├── client/          # React frontend (Vite)
│   └── src/
│       ├── pages/   # Feature pages
│       ├── components/
│       ├── store/   # Redux slices
│       └── api/     # Axios client
├── server/          # Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/    # Gemini AI integration
│   └── middleware/
└── README.md
```

## License

MIT
