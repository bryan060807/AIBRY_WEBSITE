"use client";

import { useState, useEffect, useRef } from "react";

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const successRef = useRef<HTMLParagraphElement | null>(null);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const result = await res.json().catch(() => ({}));
        throw new Error(result.error || "Something went wrong. Try again.");
      }

      setStatus("success");
      setEmail("");
    } catch (err: any) {
      setErrorMessage(err.message);
      setStatus("error");
    }
  };

  useEffect(() => {
    if (status === "success" && successRef.current) {
      successRef.current.focus();
    }
  }, [status]);

  return (
    <main className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="mb-4 text-3xl font-bold text-white">Subscribe to AIBRY Updates</h1>
      <p className="mb-6 text-gray-400">
        Get emails when new music drops, merch launches, or shows are announced.
      </p>

      <form onSubmit={subscribe} className="flex flex-col sm:flex-row gap-4 justify-center">
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Email address"
          autoComplete="email"
          pattern="^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
          title="Enter a valid email address"
          className="w-full rounded px-4 py-2 text-black"
          disabled={status === "sending"}
        />
        <button
          type="submit"
          className="rounded bg-cassette-red px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Submitting..." : "Subscribe"}
        </button>
      </form>

      {status === "success" && (
        <p
          ref={successRef}
          tabIndex={-1}
          aria-live="polite"
          className="mt-4 text-green-400"
        >
          You&apos;re subscribed! 🔥
        </p>
      )}
      {status === "error" && (
        <p aria-live="polite" className="mt-4 text-red-400">
          {errorMessage}
        </p>
      )}
    </main>
  );
}
