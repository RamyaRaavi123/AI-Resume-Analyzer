import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';

export default function MockInterview() {
  const [form, setForm] = useState({ role: '', difficulty: 'intermediate', company: '' });
  const [session, setSession] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results).map((r) => r[0].transcript).join('');
        setAnswer(transcript);
      };
      recognitionRef.current.onend = () => setListening(false);
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) return alert('Voice recognition not supported in this browser');
    if (listening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const startInterview = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/interview/mock', form);
      setSession(data);
      setCurrentQ(0);
      setAnswer('');
      setFeedback(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setEvaluating(true);
    try {
      const { data } = await api.post('/interview/answer', {
        sessionId: session._id,
        questionIndex: currentQ,
        answer,
      });
      setFeedback(data.evaluation);
      setSession(data.session);
    } catch (err) {
      alert(err.response?.data?.message || 'Evaluation failed');
    } finally {
      setEvaluating(false);
    }
  };

  const nextQuestion = () => {
    setCurrentQ((q) => q + 1);
    setAnswer('');
    setFeedback(null);
  };

  const question = session?.questions?.[currentQ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">AI Mock Interview</h1>
      <p className="text-slate-400 text-sm mb-6">Voice-based interviews with AI feedback and follow-up questions</p>

      {!session ? (
        <form onSubmit={startInterview} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl space-y-4">
          <input type="text" placeholder="Target role *" required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm" />
          <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <input type="text" placeholder="Company (optional)" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm" />
          <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 py-2.5 rounded-lg font-medium">
            {loading ? 'Starting...' : 'Start Mock Interview'}
          </button>
        </form>
      ) : (
        <div className="max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-slate-400">Question {currentQ + 1} of {session.questions.length}</span>
            <span className="text-sm text-emerald-400">{session.role} • {session.difficulty}</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
            <p className="text-lg font-medium">{question?.question}</p>
            {question?.topic && <span className="text-xs text-slate-500 mt-2 inline-block">{question.topic}</span>}
          </div>

          <div className="space-y-4 mb-6">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type or speak your answer..."
              rows={5}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
            />
            <div className="flex gap-3">
              <button onClick={toggleVoice} className={`px-4 py-2 rounded-lg text-sm font-medium ${listening ? 'bg-red-600 hover:bg-red-500' : 'bg-slate-700 hover:bg-slate-600'}`}>
                {listening ? '⏹ Stop Recording' : '🎤 Voice Input'}
              </button>
              <button onClick={submitAnswer} disabled={evaluating || !answer.trim()} className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 py-2 rounded-lg font-medium">
                {evaluating ? 'Evaluating...' : 'Submit Answer'}
              </button>
            </div>
          </div>

          {feedback && (
            <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-emerald-400">AI Feedback</h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Communication', score: feedback.communicationScore },
                  { label: 'Confidence', score: feedback.confidenceScore },
                  { label: 'Technical', score: feedback.technicalScore },
                  { label: 'Overall', score: feedback.overallScore },
                ].map((s) => (
                  <div key={s.label} className="text-center bg-slate-800 rounded-lg p-3">
                    <p className="text-2xl font-bold text-emerald-400">{s.score}</p>
                    <p className="text-xs text-slate-400">{s.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-300">{feedback.feedback}</p>
              {currentQ < session.questions.length - 1 ? (
                <button onClick={nextQuestion} className="bg-indigo-600 hover:bg-indigo-500 px-5 py-2 rounded-lg text-sm">Next Question →</button>
              ) : (
                <p className="text-emerald-400 font-medium">Interview complete! Overall score: {session.overallScore || feedback.overallScore}/100</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
