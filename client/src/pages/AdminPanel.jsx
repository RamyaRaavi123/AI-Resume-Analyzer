import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function AdminPanel() {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ category: 'technical', difficulty: 'intermediate', question: '', topic: '', company: '' });
  const [tab, setTab] = useState('analytics');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [a, u, q] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/users'),
        api.get('/admin/questions'),
      ]);
      setAnalytics(a.data);
      setUsers(u.data);
      setQuestions(q.data);
    } catch {
      /* ignore */
    }
  };

  const addQuestion = async (e) => {
    e.preventDefault();
    await api.post('/admin/questions', newQuestion);
    setNewQuestion({ category: 'technical', difficulty: 'intermediate', question: '', topic: '', company: '' });
    loadData();
  };

  const toggleModeration = async (id, isApproved) => {
    await api.patch(`/admin/questions/${id}/moderate`, { isApproved: !isApproved });
    loadData();
  };

  const tabs = ['analytics', 'users', 'questions'];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm capitalize ${tab === t ? 'bg-red-600/20 text-red-300' : 'bg-slate-800 text-slate-400'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'analytics' && analytics && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(analytics).map(([key, val]) => (
            <div key={key} className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
              <p className="text-3xl font-bold text-red-400">{val}</p>
              <p className="text-xs text-slate-500 mt-1 capitalize">{key}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'users' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-slate-400">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Streak</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t border-slate-800">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3 text-slate-400">{u.email}</td>
                  <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded ${u.role === 'admin' ? 'bg-red-500/20 text-red-300' : 'bg-slate-700 text-slate-300'}`}>{u.role}</span></td>
                  <td className="p-3">{u.streak || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'questions' && (
        <div className="space-y-6">
          <form onSubmit={addQuestion} className="bg-slate-900 border border-slate-800 rounded-xl p-5 grid md:grid-cols-3 gap-3">
            <input type="text" placeholder="Question" required value={newQuestion.question} onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })} className="md:col-span-3 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm" />
            <select value={newQuestion.category} onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })} className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm">
              <option value="technical">Technical</option>
              <option value="hr">HR</option>
              <option value="behavioral">Behavioral</option>
              <option value="system-design">System Design</option>
              <option value="coding">Coding</option>
            </select>
            <select value={newQuestion.difficulty} onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })} className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <input type="text" placeholder="Topic" value={newQuestion.topic} onChange={(e) => setNewQuestion({ ...newQuestion, topic: e.target.value })} className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm" />
            <button type="submit" className="md:col-span-3 bg-red-600 hover:bg-red-500 py-2 rounded-lg text-sm font-medium">Add Question</button>
          </form>

          <div className="space-y-3">
            {questions.map((q) => (
              <div key={q._id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm">{q.question}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-slate-800 px-2 py-0.5 rounded">{q.category}</span>
                    <span className="text-xs bg-slate-800 px-2 py-0.5 rounded">{q.difficulty}</span>
                    {!q.isApproved && <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">Pending</span>}
                  </div>
                </div>
                <button onClick={() => toggleModeration(q._id, q.isApproved)} className="text-xs text-indigo-400 hover:text-indigo-300 shrink-0">
                  {q.isApproved ? 'Unapprove' : 'Approve'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
