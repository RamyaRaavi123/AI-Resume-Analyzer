import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import api from '../api/axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard')
      .then(({ data: d }) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate-400">Loading dashboard...</p>;
  if (!data) return <p className="text-slate-400">Could not load dashboard data.</p>;

  const activityChart = {
    labels: data.activityByDay?.map((d) => d.date.slice(5)) || [],
    datasets: [
      { label: 'Sessions', data: data.activityByDay?.map((d) => d.sessions) || [], backgroundColor: 'rgba(99, 102, 241, 0.6)' },
      { label: 'Submissions', data: data.activityByDay?.map((d) => d.submissions) || [], backgroundColor: 'rgba(34, 211, 238, 0.6)' },
    ],
  };

  const readinessChart = {
    labels: ['Mock Interview', 'Coding', 'Resume ATS'],
    datasets: [{
      data: [data.stats.avgMockScore, data.stats.avgCodingScore, data.stats.avgAtsScore],
      backgroundColor: ['#6366f1', '#f97316', '#22c55e'],
    }],
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Learning Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Study Streak', value: `${data.streak} days`, icon: '🔥', color: 'text-amber-400' },
          { label: 'Readiness Score', value: `${data.interviewReadiness}%`, icon: '🎯', color: 'text-emerald-400' },
          { label: 'Mock Sessions', value: data.stats.totalSessions, icon: '🎤', color: 'text-indigo-400' },
          { label: 'Code Submissions', value: data.stats.totalSubmissions, icon: '💻', color: 'text-orange-400' },
        ].map((s) => (
          <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold mb-4">Weekly Activity</h2>
          <Bar data={activityChart} options={{ responsive: true, plugins: { legend: { labels: { color: '#94a3b8' } } }, scales: { x: { ticks: { color: '#64748b' } }, y: { ticks: { color: '#64748b' } } } }} />
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold mb-4">Score Breakdown</h2>
          <div className="flex justify-center">
            <div className="w-64">
              <Doughnut data={readinessChart} options={{ plugins: { legend: { labels: { color: '#94a3b8' } } } }} />
            </div>
          </div>
        </div>
      </div>

      {data.weakTopics?.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-4 text-red-400">Weak Topics</h2>
            <div className="space-y-2">
              {data.weakTopics.map((t, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-800 rounded-lg px-4 py-2">
                  <span className="text-sm">{t.topic}</span>
                  <span className="text-xs text-red-400">{t.count} low scores</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-4 text-cyan-400">Recommended Resources</h2>
            <div className="space-y-3">
              {data.recommendedResources?.map((r, i) => (
                <div key={i}>
                  <p className="text-sm font-medium mb-1">{r.topic}</p>
                  {r.resources?.map((url, j) => (
                    <a key={j} href={url} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 block hover:underline truncate">{url}</a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
