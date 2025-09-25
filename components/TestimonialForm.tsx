"use client";

import { useState } from "react";

export default function TestimonialForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  return (
    <section className="mx-auto max-w-xl px-6 py-16 text-center">
      <h2 className="mb-4 text-2xl font-bold text-white">Share Your Thoughts</h2>
      <p className="mb-6 text-gray-400">
        Love the music? Got a moment to share? Leave a short testimonial and you might see it featured.
      </p>

      <form
        action="https://formspree.io/f/mgvnvkna" // Replace with your real Formspree ID
        method="POST"
        onSubmit={() => setSubmitted(true)}
        className="flex flex-col gap-4"
      >
        <input
          type="text"
          name="username"
          placeholder="Your name or @handle"
          required
          className="rounded px-4 py-2 text-black"
        />
        <textarea
          name="text"
          placeholder="Your message..."
          required
          rows={4}
          className="rounded px-4 py-2 text-black"
        ></textarea>

        <button
          type="submit"
          className="rounded bg-cassette-red px-4 py-2 text-white hover:bg-red-700"
        >
          Submit
        </button>
      </form>

      {submitted && (
        <p className="mt-4 text-green-400">Thank you! Your testimonial has been submitted. 🙌</p>
      )}
    </section>
  );
}
