"use client";

import { motion } from "framer-motion";

export default function BlackboxPodcastPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-100 flex flex-col items-center justify-center px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-2xl text-center space-y-6"
      >
        <h1 className="text-4xl font-bold text-[#83c0cc]">
          Emotional Black Box – Podcast
        </h1>

        <p className="text-gray-400 leading-relaxed">
          Welcome to <span className="text-[#83c0cc] font-semibold">The Tape Room</span> — 
          a future series exploring the creative and emotional depths of AIBRY’s 
          <em> Emotional Black Box</em> project.
        </p>

        <p className="text-gray-500 text-sm">
          Each episode will dissect one tape, one voice, or one breakdown at a time.
          Expect distortion, philosophy, and the search for digital empathy.
        </p>

        <div className="mt-10">
          <div className="inline-flex items-center justify-center rounded-xl border border-gray-800 bg-[#131313] px-6 py-3 text-gray-300 cursor-not-allowed opacity-70">
            🎙️ Coming Soon
          </div>
        </div>
      </motion.div>
    </main>
  );
}
