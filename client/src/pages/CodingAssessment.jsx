import { useState, useEffect } from 'react';
import api from '../api/axios';

const LANGUAGES = ['javascript', 'python', 'java', 'cpp'];

export default function CodingAssessment() {
  const [challenges, setChallenges] = useState([]);
  const [selected, setSelected] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [hint, setHint] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    api.get('/coding').then(({ data }) => setChallenges(data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selected || timeLeft === null) return;
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [selected, timeLeft]);

  const selectChallenge = async (id) => {
    const { data } = await api.get(`/coding/${id}`);
    setSelected(data);
    setCode('');
    setResult(null);
    setHint('');
    setTimeLeft(data.timeLimit * 60);
  };

  const submitCode = async () => {
    setLoading(true);
    try {
      const { data } = await api.post(`/coding/${selected._id}/submit`, { code, language });
      setResult(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const getHint = async () => {
    try {
      const { data } = await api.post(`/coding/${selected._id}/hint`, { code, language });
      setHint(data.hint);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not get hint');
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Coding Assessment</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Challenges</h2>
          {challenges.map((c) => (
            <button
              key={c._id}
              onClick={() => selectChallenge(c._id)}
              className={`w-full text-left p-4 rounded-xl border transition-colors ${
                selected?._id === c._id ? 'border-orange-500 bg-orange-500/10' : 'border-slate-800 bg-slate-900 hover:border-slate-700'
              }`}
            >
              <p className="font-medium">{c.title}</p>
              <div className="flex gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  c.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                  c.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-300' :
                  'bg-red-500/20 text-red-300'
                }`}>{c.difficulty}</span>
                {c.company && <span className="text-xs text-slate-500">{c.company}</span>}
              </div>
            </button>
          ))}
        </div>

        {selected ? (
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{selected.title}</h2>
              {timeLeft !== null && (
                <span className={`font-mono text-sm ${timeLeft < 300 ? 'text-red-400' : 'text-slate-400'}`}>
                  ⏱ {formatTime(Math.max(0, timeLeft))}
                </span>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <p className="text-sm text-slate-300 whitespace-pre-wrap">{selected.description}</p>
              {selected.testCases?.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-slate-500 uppercase">Sample Test Cases</p>
                  {selected.testCases.map((tc, i) => (
                    <div key={i} className="bg-slate-800 rounded-lg p-3 text-xs font-mono">
                      <p>Input: {tc.input}</p>
                      <p>Output: {tc.expectedOutput}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm">
                {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              <button onClick={getHint} className="px-4 py-2 bg-amber-600/20 text-amber-300 rounded-lg text-sm hover:bg-amber-600/30">Get AI Hint</button>
              <button onClick={submitCode} disabled={loading || !code.trim()} className="flex-1 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 py-2 rounded-lg font-medium">
                {loading ? 'Evaluating...' : 'Submit Solution'}
              </button>
            </div>

            {hint && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-sm text-amber-200">
                💡 Hint: {hint}
              </div>
            )}

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`Write your ${language} solution here...`}
              rows={12}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-orange-500"
            />

            {result && (
              <div className={`rounded-xl p-5 border ${result.passed ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
                <p className="font-semibold mb-2">{result.passed ? '✅ Passed' : '❌ Needs Improvement'} — Score: {result.score}/100</p>
                <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                  <span>Time: {result.timeComplexity}</span>
                  <span>Space: {result.spaceComplexity}</span>
                </div>
                <p className="text-sm text-slate-300">{result.feedback}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-2 flex items-center justify-center text-slate-500">
            Select a challenge to begin
          </div>
        )}
      </div>
    </div>
  );
}
