"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";

const testimonials = [
  {
    text: "Your music is hauntingly beautiful.",
    source: "SoundCloud",
  },
  {
    text: "This feels like a forgotten memory — incredible work.",
    source: "SoundCloud",
  },
  {
    text: "I keep coming back to this track. Absolute masterpiece.",
    source: "SoundCloud",
  },
  {
    text: "Atmospheric and powerful. Love the guitar tones.",
    source: "SoundCloud",
  },
];

export default function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);
  const total = testimonials.length;

  const next = () => setIndex((prev) => (prev + 1) % total);
  const prev = () => setIndex((prev) => (prev - 1 + total) % total);

  // Auto-slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [index]);

  return (
    <section className="relative mx-auto max-w-3xl px-6 py-16 text-center text-white">
      <h2 className="mb-8 text-2xl font-bold tracking-wide">What Listeners Say</h2>

      <div className="relative min-h-[120px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="px-4"
          >
            <div className="mb-4 text-xl text-gray-200 italic">
              <FaQuoteLeft className="inline mr-2 text-cassette-red" />
              {testimonials[index].text}
              <FaQuoteRight className="inline ml-2 text-cassette-red" />
            </div>
            <p className="text-sm text-gray-400">— {testimonials[index].source}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={prev}
          className="rounded bg-gray-800 px-3 py-1 text-white hover:bg-gray-700"
        >
          ◀
        </button>
        <button
          onClick={next}
          className="rounded bg-gray-800 px-3 py-1 text-white hover:bg-gray-700"
        >
          ▶
        </button>
      </div>
    </section>
  );
}
