import { useState, useEffect } from 'react';
import api from '../api/axios';

const typeIcons = { reminder: '⏰', progress: '📈', contest: '🏆', 'study-plan': '📋', system: '📢' };

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      let { data } = await api.get('/notifications');
      if (data.length === 0) {
        await api.post('/notifications/seed');
        ({ data } = await api.get('/notifications'));
      }
      setNotifications(data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = async () => {
    await api.patch('/notifications/read-all');
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unread = notifications.filter((n) => !n.read).length;

  if (loading) return <p className="text-slate-400">Loading...</p>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unread > 0 && <p className="text-sm text-indigo-400">{unread} unread</p>}
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="text-sm text-indigo-400 hover:text-indigo-300">Mark all read</button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n._id}
            onClick={() => !n.read && markRead(n._id)}
            className={`p-4 rounded-xl border cursor-pointer transition-colors ${
              n.read ? 'bg-slate-900/50 border-slate-800 opacity-60' : 'bg-slate-900 border-indigo-500/30'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">{typeIcons[n.type] || '📢'}</span>
              <div>
                <p className="font-medium text-sm">{n.title}</p>
                <p className="text-sm text-slate-400 mt-1">{n.message}</p>
                <p className="text-xs text-slate-600 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
