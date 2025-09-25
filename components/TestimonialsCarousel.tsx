"use client";

import { useState, useCallback, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";

const testimonials = [
  {
    user: "@noirnoise",
    quote: "Your sound is haunting and beautiful — I had chills the first time I listened.",
  },
  {
    user: "@ambientalchemy",
    quote: "This belongs in a film score. It's cinematic, eerie, and unforgettable.",
  },
  {
    user: "@voidwalker",
    quote: "AIBRY doesn’t make tracks — they craft sonic rituals.",
  },
  {
    user: "@nocturnelover",
    quote: "I've had this on repeat for hours. Deeply moving.",
  },
  {
    user: "@topfan92",
    quote: "Been following since Bandcamp days. AIBRY only gets better.",
  },
];

export default function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => next(),
    onSwipedRight: () => prev(),
    preventScrollOnSwipe: true,
    trackTouch: true,
    trackMouse: false,
});

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="mt-20 px-4 text-center" {...swipeHandlers}>
      <h2 className="mb-6 text-2xl font-bold text-white">What Listeners Are Saying</h2>

      <div className="relative mx-auto max-w-xl rounded bg-[#1b1b1b] p-6 text-white shadow-lg">
        <FaQuoteLeft className="mb-2 text-2xl text-cassette-red" />
        <p className="text-lg italic">{testimonials[index].quote}</p>
        <FaQuoteRight className="mt-2 text-2xl text-cassette-red" />
        <p className="mt-4 text-sm text-gray-400">{testimonials[index].user}</p>

        {/* Navigation buttons (optional) */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={prev}
            className="rounded-full border border-gray-500 px-3 py-1 text-sm hover:bg-gray-700"
          >
            ← Prev
          </button>
          <button
            onClick={next}
            className="rounded-full border border-gray-500 px-3 py-1 text-sm hover:bg-gray-700"
          >
            Next →
          </button>
        </div>
      </div>
    </section>
  );
}
