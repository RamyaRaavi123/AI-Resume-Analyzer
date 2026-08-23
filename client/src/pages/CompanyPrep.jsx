import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function CompanyPrep() {
  const [companies, setCompanies] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [experience, setExperience] = useState({ role: '', experience: '', rating: 5 });
  const [tab, setTab] = useState('faqs');

  useEffect(() => {
    api.get('/companies').then(({ data }) => setCompanies(data)).catch(() => {});
  }, []);

  const loadCompany = async (name) => {
    setSelected(name);
    const { data } = await api.get(`/companies/${name}`);
    setDetail(data);
    setTab('faqs');
  };

  const submitExperience = async (e) => {
    e.preventDefault();
    await api.post(`/companies/${selected}/experience`, experience);
    loadCompany(selected);
    setExperience({ role: '', experience: '', rating: 5 });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Company-Specific Preparation</h1>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          {companies.map((c) => (
            <button
              key={c.name}
              onClick={() => loadCompany(c.name)}
              className={`w-full text-left p-4 rounded-xl border transition-colors ${
                selected === c.name ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-900 hover:border-slate-700'
              }`}
            >
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{c.description}</p>
            </button>
          ))}
        </div>

        {detail ? (
          <div className="lg:col-span-3">
            <h2 className="text-xl font-semibold mb-4">{detail.name}</h2>
            <p className="text-sm text-slate-400 mb-4">{detail.description}</p>

            <div className="flex gap-2 mb-4 flex-wrap">
              {['faqs', 'experiences', 'coding', 'hr', 'system-design'].map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-xs capitalize ${tab === t ? 'bg-indigo-600/20 text-indigo-300' : 'bg-slate-800 text-slate-400'}`}>
                  {t.replace('-', ' ')}
                </button>
              ))}
            </div>

            {tab === 'faqs' && (
              <div className="space-y-3">
                {(detail.faqs?.length > 0 ? detail.faqs : detail.faqsFromBank)?.map((f, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <p className="font-medium text-sm">{f.question}</p>
                    {f.answer && <p className="text-sm text-slate-400 mt-2">{f.answer}</p>}
                    {f.category && <span className="text-xs text-slate-500 mt-1 inline-block">{f.category}</span>}
                  </div>
                )) || <p className="text-slate-500 text-sm">No FAQs available yet.</p>}
              </div>
            )}

            {tab === 'experiences' && (
              <div className="space-y-4">
                {detail.interviewExperiences?.map((exp, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{exp.role}</span>
                      <span className="text-amber-400 text-sm">{'★'.repeat(exp.rating)}{'☆'.repeat(5 - exp.rating)}</span>
                    </div>
                    <p className="text-sm text-slate-300">{exp.experience}</p>
                  </div>
                ))}
                <form onSubmit={submitExperience} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-medium">Share Your Experience</p>
                  <input type="text" placeholder="Role" required value={experience.role} onChange={(e) => setExperience({ ...experience, role: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm" />
                  <textarea placeholder="Your interview experience..." required value={experience.experience} onChange={(e) => setExperience({ ...experience, experience: e.target.value })} rows={3} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm" />
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm">Submit</button>
                </form>
              </div>
            )}

            {tab === 'coding' && (
              <div className="space-y-3">
                {detail.codingProblems?.length > 0 ? detail.codingProblems.map((p, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <p className="font-medium">{p.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded mt-1 inline-block ${
                      p.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' : p.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'
                    }`}>{p.difficulty}</span>
                  </div>
                )) : <p className="text-slate-500 text-sm">No coding problems tagged for this company yet.</p>}
              </div>
            )}

            {tab === 'hr' && (
              <div className="space-y-2">
                {(detail.hrQuestions?.length > 0 ? detail.hrQuestions : ['Tell me about yourself', 'Why do you want to join us?', 'Describe a challenging situation']).map((q, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm">{q}</div>
                ))}
              </div>
            )}

            {tab === 'system-design' && (
              <div className="space-y-2">
                {(detail.systemDesignQuestions?.length > 0 ? detail.systemDesignQuestions : ['Design a chat application', 'Design a notification system', 'Design a rate limiter']).map((q, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm">{q}</div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-3 flex items-center justify-center text-slate-500">
            Select a company to view preparation materials
          </div>
        )}
      </div>
    </div>
  );
}
