import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const links = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/resume', label: 'Resume Analyzer', icon: '📄' },
  { to: '/interview-prep', label: 'Interview Prep', icon: '📚' },
  { to: '/mock-interview', label: 'Mock Interview', icon: '🎤' },
  { to: '/coding', label: 'Coding', icon: '💻' },
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/companies', label: 'Companies', icon: '🏢' },
  { to: '/chat', label: 'AI Chat', icon: '🤖' },
  { to: '/notifications', label: 'Notifications', icon: '🔔' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-40">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          InterviewAI
        </h1>
        <p className="text-xs text-slate-500 mt-1">Prep Platform</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`
            }
          >
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
        {user?.role === 'admin' && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-red-600/20 text-red-300' : 'text-slate-400 hover:bg-slate-800'
              }`
            }
          >
            <span>⚙️</span> Admin Panel
          </NavLink>
        )}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <p className="text-sm text-slate-400 truncate">{user?.name}</p>
        <button onClick={handleLogout} className="mt-2 text-xs text-red-400 hover:text-red-300">
          Sign out
        </button>
      </div>
    </aside>
  );
}
