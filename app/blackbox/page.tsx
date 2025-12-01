// app/blackbox/page.tsx
import Link from 'next/link';

export default function BlackboxHomePage() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">
          Emotional Black Box
        </h1>
        <p className="text-sm md:text-base text-neutral-300 max-w-xl">
          An experimental AI that turns your emotional chaos into cassette tapes,
          spoken word, and distorted artifacts inside the AIBRY universe.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/blackbox/devlog"
            className="px-4 py-2 rounded-full bg-white text-black text-sm font-semibold"
          >
            Read the Devlog
          </Link>
          <Link
            href="/blackbox/alpha"
            className="px-4 py-2 rounded-full border border-neutral-600 text-sm text-neutral-200 hover:bg-neutral-100 hover:text-black transition"
          >
            Join Alpha (Soon)
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="border border-neutral-800 rounded-lg p-4 bg-black/40">
          <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 mb-2">
            Devlog
          </p>
          <h2 className="text-sm font-semibold mb-1">Build Diary</h2>
          <p className="text-xs text-neutral-400 mb-3">
            Follow the day-by-day process of creating the Emotional Black Box:
            architecture, failures, breakthroughs, and philosophy.
          </p>
          <Link
            href="/blackbox/devlog"
            className="text-xs text-neutral-200 underline underline-offset-4"
          >
            Enter devlog
          </Link>
        </div>

        <div className="border border-neutral-800 rounded-lg p-4 bg-black/40">
          <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 mb-2">
            Lore
          </p>
          <h2 className="text-sm font-semibold mb-1">Tapes & Static</h2>
          <p className="text-xs text-neutral-400 mb-3">
            The fictional and emotional world around the Black Box: tapes,
            vaults, ghosts, and distortion.
          </p>
          <span className="text-[11px] text-neutral-500">
            Coming soon.
          </span>
        </div>

        <div className="border border-neutral-800 rounded-lg p-4 bg-black/40">
          <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 mb-2">
            Interface
          </p>
          <h2 className="text-sm font-semibold mb-1">Use the Machine</h2>
          <p className="text-xs text-neutral-400 mb-3">
            A dedicated surface where you dump your thoughts and the system
            returns tapes, lyrics, and distorted reflections.
          </p>
          <span className="text-[11px] text-neutral-500">
            Experimental UI in progress.
          </span>
        </div>
      </section>
    </div>
  );
}
