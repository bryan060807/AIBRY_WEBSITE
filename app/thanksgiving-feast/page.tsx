"use client";

import React, { useState } from "react";

type RSVPStatus = "idle" | "submitting" | "success" | "error";

export default function ThanksgivingFeastPage() {
  const [status, setStatus] = useState<RSVPStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      guests: Number(formData.get("guests") || 1),
      message: (formData.get("message") as string) || "",
      dietary: (formData.get("dietary") as string) || "",
      needRide: formData.get("needRide") === "on",
      bringingDish: formData.get("bringingDish") === "on",
    };

    try {
      const res = await fetch("/api/thanksgiving-rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to submit RSVP");
      }

      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setStatus("error");
      setError(err?.message || "Something went wrong. Try again.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-slate-950 to-slate-950" />
        <div className="absolute -top-32 left-20 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-rose-500/10 blur-3xl" />
      </div>

      <main className="mx-auto flex max-w-5xl flex-col gap-16 px-4 py-10 sm:py-14">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 text-xl">
              🦃
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-amber-300">
                Thanksgiving Feast
              </p>
              <h1 className="text-xl font-semibold sm:text-2xl">
                Babygirl&apos;s Community Table
              </h1>
            </div>
          </div>
          <a
            href="#rsvp"
            className="rounded-full bg-amber-400 px-5 py-2 text-xs font-semibold text-slate-950 shadow-lg shadow-amber-400/40 hover:bg-amber-300 transition-colors"
          >
            Reserve a plate
          </a>
        </header>

        {/* Intro + details */}
        <section className="grid gap-10 md:grid-cols-[1.2fr,1fr] md:items-start">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              A seat for anyone who needs one.
            </h2>
            <p className="mt-3 text-sm text-slate-200/90">
              She&apos;s not just cooking a meal, she&apos;s building a safe
              place for people who don&apos;t have family nearby, don&apos;t
              have the money for a big dinner, or just can&apos;t stand
              pretending everything&apos;s fine at a table that doesn&apos;t
              feel like home.
            </p>
            <p className="mt-3 text-sm text-slate-200/90">
              If your fridge is empty, your house is quiet, or your heart’s
              heavy, this table is for you.
            </p>

            <div className="mt-6 grid gap-4 text-xs sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3">
                <p className="font-semibold text-amber-300">When</p>
                <p>Thanksgiving Day</p>
                <p className="text-slate-300/80">Doors open at 3:00 PM</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3">
                <p className="font-semibold text-amber-300">Where</p>
                <p>Private home kitchen</p>
                <p className="text-slate-300/80">Address sent after RSVP</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3">
                <p className="font-semibold text-amber-300">Who</p>
                <p className="text-slate-300/90">
                  Anyone needing food, warmth, or just not being alone.
                </p>
              </div>
            </div>
          </div>

          {/* Menu preview */}
          <div className="rounded-3xl border border-amber-200/30 bg-slate-950/80 p-5 shadow-xl shadow-amber-500/20 text-xs">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-300">
              Menu preview
            </p>
            <ul className="mt-3 space-y-1.5 text-slate-200/90">
              <li>• Roasted turkey with herbs</li>
              <li>• Mashed potatoes & homemade gravy</li>
              <li>• Mac & cheese that actually slaps</li>
              <li>• Stuffing, green bean casserole, and more</li>
              <li>• Pumpkin, pecan & apple desserts</li>
            </ul>
            <p className="mt-3 text-[11px] text-slate-400">
              Menu may change depending on donations and ingredients, but the
              love level stays at max.
            </p>
          </div>
        </section>

        {/* RSVP FORM */}
        <section
          id="rsvp"
          className="rounded-3xl border border-amber-200/30 bg-slate-950/90 p-5 shadow-2xl shadow-amber-500/20 sm:p-7"
        >
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-300">
                RSVP
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">
                Reserve your plate
              </h2>
              <p className="mt-1 text-xs text-slate-200/90">
                No payment. No ticket. Just info so we know how many people
                we&apos;re feeding and how to send details.
              </p>
            </div>
            <div className="max-w-xs rounded-2xl border border-amber-200/20 bg-amber-500/10 px-4 py-3 text-[11px] text-amber-100">
              <p className="mb-1 font-semibold text-amber-300">
                Need help getting there?
              </p>
              <p>
                Check the ride box and we&apos;ll try to coordinate something if
                we can.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-4 text-sm sm:grid-cols-2"
          >
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-100">
                Name*
              </label>
              <input
                name="name"
                required
                className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-400/40"
                placeholder="First & last"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-100">
                Email or phone*
              </label>
              <input
                name="email"
                required
                className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-400/40"
                placeholder="So we can send details"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-100">
                How many people (including you)?*
              </label>
              <input
                type="number"
                name="guests"
                min={1}
                max={10}
                defaultValue={1}
                required
                className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-400/40"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-100">
                Dietary needs
              </label>
              <input
                name="dietary"
                className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-400/40"
                placeholder="Allergies, vegetarian, etc."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-100">
                Anything we should know?
              </label>
              <textarea
                name="message"
                rows={3}
                className="w-full resize-none rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 outline-none focus:border-amber-300 focus:ring-2 focus:ring-amber-400/40"
                placeholder="Share your situation, comfort needs, or if someone with you needs extra support."
              />
            </div>

            <div className="flex flex-col gap-2 text-xs text-slate-200/90">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  name="needRide"
                  className="h-4 w-4 rounded border-white/20 bg-slate-900 text-amber-400"
                />
                <span>I might need help with a ride</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  name="bringingDish"
                  className="h-4 w-4 rounded border-white/20 bg-slate-900 text-amber-400"
                />
                <span>I&apos;d like to bring a dish if I can</span>
              </label>
            </div>

            <div className="flex flex-col items-start justify-end gap-2 sm:items-end">
              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-400/40 hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-amber-400/60 transition-colors"
              >
                {status === "submitting" ? "Sending..." : "Submit RSVP"}
              </button>
              {status === "success" && (
                <p className="text-xs text-emerald-300">
                  Got it. We&apos;ll send you the details.
                </p>
              )}
              {status === "error" && (
                <p className="text-xs text-rose-300">
                  {error || "Something broke. Try again in a minute."}
                </p>
              )}
            </div>
          </form>
        </section>

        <footer className="pb-4 pt-2 text-center text-[11px] text-slate-500">
          A little kindness goes a stupidly long way.
        </footer>
      </main>
    </div>
  );
}
