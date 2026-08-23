import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../store/slices/authSlice';
import api from '../api/axios';

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [form, setForm] = useState({
    name: '', skills: '', interests: '', targetRole: '', targetCompanies: '',
  });
  const [savedSessions, setSavedSessions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    dispatch(fetchProfile());
    api.get('/auth/saved-sessions').then(({ data }) => setSavedSessions(data)).catch(() => {});
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        skills: (user.skills || []).join(', '),
        interests: (user.interests || []).join(', '),
        targetRole: user.targetRole || '',
        targetCompanies: (user.targetCompanies || []).join(', '),
      });
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/auth/profile', {
        name: form.name,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        interests: form.interests.split(',').map((s) => s.trim()).filter(Boolean),
        targetRole: form.targetRole,
        targetCompanies: form.targetCompanies.split(',').map((s) => s.trim()).filter(Boolean),
      });
      dispatch(fetchProfile());
      setMessage('Profile updated successfully');
    } catch {
      setMessage('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>

      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Full Name</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Email</label>
          <input type="email" value={user?.email || ''} disabled className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-500" />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Skills (comma separated)</label>
          <input type="text" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="React, Node.js, Python" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Interests</label>
          <input type="text" value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })} placeholder="Web Dev, ML, DevOps" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Target Role</label>
          <input type="text" value={form.targetRole} onChange={(e) => setForm({ ...form, targetRole: e.target.value })} placeholder="Software Engineer" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Target Companies</label>
          <input type="text" value={form.targetCompanies} onChange={(e) => setForm({ ...form, targetCompanies: e.target.value })} placeholder="Google, Amazon, Microsoft" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm" />
        </div>

        {message && <p className="text-sm text-emerald-400">{message}</p>}

        <button type="submit" disabled={saving} className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-6 py-2 rounded-lg font-medium">
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>

      {savedSessions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Saved Interview Sessions</h2>
          <div className="space-y-3">
            {savedSessions.map((s) => (
              <div key={s._id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <p className="font-medium">{s.role} — {s.type}</p>
                <p className="text-xs text-slate-500">{new Date(s.createdAt).toLocaleDateString()} • Score: {s.overallScore || 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
