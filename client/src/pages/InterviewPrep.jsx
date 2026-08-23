import { useState } from 'react';
import api from '../api/axios';

export default function InterviewPrep() {
  const [form, setForm] = useState({ role: '', difficulty: 'intermediate', company: '' });
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!form.role) return setError('Target role is required');

    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/interview/prep', form);
      setSession(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Personalized Interview Preparation</h1>
      <p className="text-slate-400 text-sm mb-6">Questions tailored to your resume and target role</p>

      <form onSubmit={handleGenerate} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 grid md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Target role *"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
        />
        <select
          value={form.difficulty}
          onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
          className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <input
          type="text"
          placeholder="Company (optional)"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
        />
        <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-2 rounded-lg font-medium">
          {loading ? 'Generating...' : 'Generate Questions'}
        </button>
      </form>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {session && (
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">Interview Questions</h2>
            <div className="space-y-4">
              {session.questions?.map((q, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <span className="bg-indigo-600/20 text-indigo-300 text-xs font-bold px-2 py-1 rounded">{i + 1}</span>
                    <div>
                      <p className="font-medium">{q.question}</p>
                      {q.topic && <span className="text-xs text-slate-500 mt-1 inline-block">{q.topic}</span>}
                      {q.tips && <p className="text-sm text-slate-400 mt-2">💡 {q.tips}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {session.roadmap?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Topic-wise Roadmap</h2>
              <div className="space-y-3">
                {session.roadmap.map((item, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{item.topic}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        item.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                        item.priority === 'medium' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>{item.priority}</span>
                    </div>
                    {item.resources?.map((r, j) => (
                      <a key={j} href={r.startsWith('http') ? r : '#'} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 block hover:underline">{r}</a>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
