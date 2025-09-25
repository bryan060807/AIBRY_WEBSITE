"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

export default function NewsletterModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const result = await res.json();
    if (res.ok) {
      setSubmitted(true);
      setEmail("");
    } else {
      setError(result.error || "Something went wrong");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 px-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md rounded bg-white p-6 shadow-xl"
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 text-gray-500 hover:text-black"
              aria-label="Close"
            >
              <FaTimes />
            </button>

            <h2 className="mb-2 text-xl font-bold text-black">Subscribe to the AIBRY Newsletter</h2>
            <p className="mb-4 text-sm text-gray-700">
              Get early access to new music, merch drops, and special announcements.
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded border border-gray-300 px-4 py-2 text-black"
                />
                <button
                  type="submit"
                  className="rounded bg-cassette-red px-4 py-2 font-semibold text-white hover:bg-red-700"
                >
                  Subscribe
                </button>
                {error && <p className="text-sm text-red-500">{error}</p>}
              </form>
            ) : (
              <p className="text-green-600 font-semibold">You're subscribed! 🎉</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
