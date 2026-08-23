import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const features = [
  { title: 'Resume Analyzer', desc: 'ATS score, skill gaps, keyword optimization', to: '/resume', color: 'from-violet-500 to-purple-600' },
  { title: 'Interview Prep', desc: 'Personalized questions by role & difficulty', to: '/interview-prep', color: 'from-blue-500 to-cyan-600' },
  { title: 'Mock Interview', desc: 'Voice-based AI interviews with feedback', to: '/mock-interview', color: 'from-emerald-500 to-teal-600' },
  { title: 'Coding Assessment', desc: 'Timed challenges with AI hints', to: '/coding', color: 'from-orange-500 to-amber-600' },
  { title: 'Learning Dashboard', desc: 'Streaks, progress charts, readiness score', to: '/dashboard', color: 'from-pink-500 to-rose-600' },
  { title: 'Company Prep', desc: 'FAQs, experiences, company-specific problems', to: '/companies', color: 'from-indigo-500 to-blue-600' },
];

export default function Home() {
  const { user } = useSelector((s) => s.auth);

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋
        </h1>
        <p className="text-slate-400">Your AI-powered interview preparation platform</p>
        {user?.streak > 0 && (
          <div className="mt-4 inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 text-amber-300 text-sm">
            🔥 {user.streak} day streak
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f) => (
          <Link
            key={f.to}
            to={f.to}
            className="group p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-xl mb-4`}>
              ✦
            </div>
            <h3 className="text-lg font-semibold mb-1 group-hover:text-indigo-300 transition-colors">{f.title}</h3>
            <p className="text-sm text-slate-400">{f.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-indigo-900/40 to-cyan-900/40 border border-indigo-500/20">
        <h2 className="text-xl font-semibold mb-2">Quick Start</h2>
        <p className="text-slate-400 text-sm mb-4">
          Upload your resume first to unlock personalized interview questions and mock interviews.
        </p>
        <Link to="/resume" className="inline-block bg-indigo-600 hover:bg-indigo-500 px-5 py-2 rounded-lg text-sm font-medium transition-colors">
          Analyze Resume →
        </Link>
      </div>
    </div>
  );
}
