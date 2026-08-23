import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, clearError } from '../store/slices/authSlice';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = isRegister ? registerUser(form) : loginUser({ email: form.email, password: form.password });
    const result = await dispatch(action);
    if (result.meta.requestStatus === 'fulfilled') navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            InterviewAI
          </h1>
          <p className="text-slate-500 mt-2">AI Interview Preparation Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-semibold">{isRegister ? 'Create Account' : 'Sign In'}</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          {isRegister && (
            <input
              type="text"
              placeholder="Full name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
          />

          <input
            type="password"
            placeholder="Password (min 6 chars)"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-2.5 rounded-lg font-medium transition-colors"
          >
            {loading ? 'Please wait...' : isRegister ? 'Register' : 'Sign In'}
          </button>

          <p className="text-center text-sm text-slate-400">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); dispatch(clearError()); }}
              className="text-indigo-400 hover:text-indigo-300"
            >
              {isRegister ? 'Sign In' : 'Register'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
