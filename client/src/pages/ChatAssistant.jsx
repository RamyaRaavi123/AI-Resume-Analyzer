import { useState, useRef, useEffect } from 'react';
import api from '../api/axios';

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your AI interview coach. Ask me about interview questions, concepts, learning plans, or paste code for review.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const { data } = await api.post('/chat', { message: userMsg });
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Explain binary search',
    'Common HR interview questions',
    'Create a 2-week DSA study plan',
    'Review my approach to two-pointer technique',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <h1 className="text-2xl font-bold mb-4">AI Chat Assistant</h1>

      <div className="flex-1 overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 mb-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
              m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-200'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 px-4 py-3 rounded-2xl text-sm text-slate-400">Thinking...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {quickPrompts.map((p) => (
          <button key={p} onClick={() => setInput(p)} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full text-slate-400">
            {p}
          </button>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about interviews..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
        />
        <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-6 rounded-xl font-medium">
          Send
        </button>
      </form>
    </div>
  );
}
