// app/newsletter/page.tsx
"use client";

import { useState } from "react";

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    // Use the local API route, just like the modal
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setStatus("success");
      setEmail("");
    } else {
      const result = await res.json();
      setErrorMessage(result.error || "Something went wrong. Try again.");
      setStatus("error");
    }
  };

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
        <p className="mt-4 text-green-400">You&apos;re subscribed! 🔥</p>
      )}
      {status === "error" && (
        <p className="mt-4 text-red-400">{errorMessage}</p>
      )}
    </main>
  );
}