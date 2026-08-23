import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  const loadHistory = async () => {
    try {
      const { data } = await api.get('/resume/history');
      setHistory(data);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => { loadHistory(); }, []);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select a resume file');

    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('targetRole', targetRole);

    try {
      const { data } = await api.post('/resume/analyze', formData);
      setResult(data);
      loadHistory();
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const ScoreRing = ({ score }) => (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
        <circle
          cx="50" cy="50" r="45" fill="none"
          stroke={score >= 70 ? '#22c55e' : score >= 40 ? '#eab308' : '#ef4444'}
          strokeWidth="8"
          strokeDasharray={`${score * 2.83} 283`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold">{score}</span>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">AI Resume Analyzer</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <form onSubmit={handleAnalyze} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Upload Resume (PDF, DOC, TXT)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white file:cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Target Role (optional)</label>
            <input
              type="text"
              placeholder="e.g. Frontend Developer"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-2.5 rounded-lg font-medium">
            {loading ? 'Analyzing resume (may take ~30s)...' : 'Analyze Resume'}
          </button>
        </form>

        {result && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="text-center">
              <p className="text-sm text-slate-400 mb-2">ATS Score</p>
              <ScoreRing score={result.atsScore || 0} />
            </div>

            {result.summary && <p className="text-sm text-slate-300">{result.summary}</p>}

            {result.strengths?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-green-400 mb-2">Strengths</h3>
                <ul className="space-y-1">{result.strengths.map((s, i) => <li key={i} className="text-sm text-slate-300">✓ {s}</li>)}</ul>
              </div>
            )}

            {result.skillGaps?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-amber-400 mb-2">Skill Gaps</h3>
                <div className="flex flex-wrap gap-2">
                  {result.skillGaps.map((g, i) => (
                    <span key={i} className="text-xs bg-amber-500/10 text-amber-300 px-2 py-1 rounded-full">{g}</span>
                  ))}
                </div>
              </div>
            )}

            {result.keywords && (
              <div>
                <h3 className="text-sm font-semibold text-indigo-400 mb-2">Keyword Optimization</h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-green-400 mb-1">Present</p>
                    {result.keywords.present?.map((k, i) => <span key={i} className="inline-block bg-green-500/10 text-green-300 px-2 py-0.5 rounded mr-1 mb-1">{k}</span>)}
                  </div>
                  <div>
                    <p className="text-red-400 mb-1">Missing</p>
                    {result.keywords.missing?.map((k, i) => <span key={i} className="inline-block bg-red-500/10 text-red-300 px-2 py-0.5 rounded mr-1 mb-1">{k}</span>)}
                  </div>
                </div>
              </div>
            )}

            {result.suggestions?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-cyan-400 mb-2">Improvement Suggestions</h3>
                <ul className="space-y-1">{result.suggestions.map((s, i) => <li key={i} className="text-sm text-slate-300">• {s}</li>)}</ul>
              </div>
            )}

            {result.recommendedRoles?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-purple-400 mb-2">Recommended Roles</h3>
                <div className="flex flex-wrap gap-2">
                  {result.recommendedRoles.map((r, i) => (
                    <span key={i} className="text-xs bg-purple-500/10 text-purple-300 px-3 py-1 rounded-full">{r}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Analysis History</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {history.map((h) => (
              <button key={h._id} onClick={() => setResult(h)} className="text-left bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-indigo-500/50 transition-colors">
                <p className="font-medium truncate">{h.fileName}</p>
                <p className="text-xs text-slate-500 mt-1">{new Date(h.createdAt).toLocaleDateString()}</p>
                <p className="text-indigo-400 text-sm mt-2">ATS: {h.atsScore}/100</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
