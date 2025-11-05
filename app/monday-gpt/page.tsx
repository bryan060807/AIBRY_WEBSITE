'use client';
import { useState } from 'react';

export default function MondayGPT() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', content: input }]);
    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: 'AI responses are currently disabled. Come back soon.' },
    ]);
    setInput('');
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-white mb-6">Monday-GPT</h1>
      <p className="text-gray-400 mb-8">
        This section is temporarily running in offline mode. No AI connections active.
      </p>

      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6 h-96 overflow-y-auto text-left">
        {messages.length === 0 ? (
          <p className="text-gray-500 italic">Start typing below to chat.</p>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`mb-3 ${msg.role === 'user' ? 'text-blue-400' : 'text-green-400'}`}>
              <strong>{msg.role === 'user' ? 'You:' : 'Monday-GPT:'}</strong> {msg.content}
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center justify-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 rounded-md bg-gray-800 border border-gray-700 p-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#629aa9]"
        />
        <button
          type="submit"
          className="px-4 py-3 rounded-md bg-[#629aa9] text-white font-semibold hover:bg-[#4f7f86] transition"
        >
          Send
        </button>
      </form>
    </main>
  );
}
