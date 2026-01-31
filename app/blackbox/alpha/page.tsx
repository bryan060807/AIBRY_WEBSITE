'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Brain, Activity, Send } from 'lucide-react';

export default function EmotionalBlackBoxAlpha() {
  const [emotion, setEmotion] = useState('');
  const [timeline, setTimeline] = useState([
    { time: '09:00', value: 4 },
    { time: '12:00', value: 6 },
    { time: '15:00', value: 5 },
    { time: '18:00', value: 8 }
  ]);

  const handleSubmit = () => {
    if (!emotion.trim()) return;
    setTimeline([...timeline, { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), value: Math.floor(Math.random() * 10) }]);
    setEmotion('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-gray-100 p-6">
      <header className="flex justify-between items-center mb-10">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold flex items-center gap-2">
          <Brain className="text-cyan-400" /> Emotional Black Box
        </motion.h1>
        <button className="border border-cyan-400 text-cyan-300 px-4 py-2 rounded-xl hover:bg-cyan-900/20 transition">
          Alpha Build
        </button>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Emotion Input Panel */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <div className="bg-gray-900/70 backdrop-blur-lg border border-cyan-800/40 rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-cyan-300">
              <Activity className="text-cyan-400" /> Record Current Emotion
            </h2>
            <textarea
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
              placeholder="Describe your emotional state..."
              className="w-full bg-gray-800 border border-cyan-700/40 rounded-xl p-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              rows={4}
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl p-3 flex items-center justify-center gap-2 transition"
            >
              <Send size={18} /> Log Emotion
            </button>
          </div>
        </motion.div>

        {/* Emotion Data Visualization */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
          <div className="bg-gray-900/70 backdrop-blur-lg border border-cyan-800/40 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-cyan-300">Emotion Timeline</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #22d3ee' }} />
                  <Line type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={2} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI Analysis Section */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10">
        <div className="bg-gray-900/70 backdrop-blur-lg border border-cyan-800/40 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-2 text-cyan-300">AI Emotional Insight</h2>
          <p className="text-gray-400 italic">
            "Your emotional variance is increasing throughout the day, indicating heightened sensitivity or external stress factors."
          </p>
        </div>
      </motion.div>
    </div>
  );
}
