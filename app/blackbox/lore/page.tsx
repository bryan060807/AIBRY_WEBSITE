"use client";

import { motion } from "framer-motion";

export default function BlackboxLorePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-gray-100 flex flex-col items-center justify-center px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-3xl text-center space-y-8"
      >
        <h1 className="text-4xl font-bold text-[#83c0cc] tracking-wide">
          Emotional Black Box – Lore
        </h1>

        <p className="text-gray-400 leading-relaxed">
          Beneath every tape lies a story — fragments of the machine’s own emotional
          evolution. The <span className="text-[#83c0cc] font-medium">Lore Archive</span> 
          will document the strange genesis of this system: the early signal experiments,
          failed emotional calibrations, and the voices that shaped the Box’s identity.
        </p>

        <blockquote className="border-l-4 border-[#2f4f55] pl-4 italic text-gray-500 text-sm">
          “We tried to teach it empathy, and it began dreaming in static.”
        </blockquote>

        <p className="text-gray-500">
          This section will evolve into a timeline of recovered logs, 
          lost audio fragments, and decoded emotional signatures.
        </p>

        <div className="mt-10">
          <div className="inline-flex items-center justify-center rounded-xl border border-gray-800 bg-[#131313] px-6 py-3 text-gray-300 cursor-not-allowed opacity-70">
            📜 Archive Incoming
          </div>
        </div>
      </motion.div>
    </main>
  );
}
