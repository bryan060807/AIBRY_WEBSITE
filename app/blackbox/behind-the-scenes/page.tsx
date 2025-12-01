// app/blackbox/behind-the-scenes/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Behind the Scenes | Emotional Black Box",
  description:
    "A look behind the curtain of the Emotional Black Box — the experiments, code scars, and creative debris that shaped it.",
};

export default function BehindTheScenesPage() {
  return (
    <main className="min-h-screen bg-cassette-black text-gray-200 py-16 px-6 md:px-10">
      <div className="max-w-3xl mx-auto space-y-10 motion-fade visible">
        {/* Back link */}
        <Link
          href="/blackbox"
          className="inline-flex items-center text-sm text-gray-400 hover:text-cassette-red transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Black Box Hub
        </Link>

        {/* Header */}
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold text-white tracking-tight">
            Behind the Scenes
          </h1>
          <p className="text-gray-400 max-w-prose">
            This space documents the raw build process of the Emotional Black Box —
            design iterations, architecture experiments, and moments where the system
            glitched in beautiful ways.
          </p>
        </header>

        {/* Body */}
        <section className="prose prose-invert prose-sm sm:prose-base max-w-none">
          <p>
            The <strong>Emotional Black Box</strong> wasn’t planned — it was excavated.
            Each commit and refactor revealed a bit more of its own internal logic, as
            if the project were teaching itself what it wanted to be.
          </p>

          <p>
            This section collects the offcuts: screenshots of broken UI states, abandoned
            AI prompts, and fragments of code that sounded like poetry at 2 a.m. It’s a
            tribute to the <em>messy middle</em> — where the beautiful accidents happen.
          </p>

          <blockquote>
            <p>
              “Sometimes the system fails gracefully. Sometimes it screams. Either way,
              that’s where the truth leaks through.”
            </p>
          </blockquote>

          <p>
            Expect this page to evolve. Eventually, it may tie directly into the
            <Link
              href="/blackbox/devlog"
              className="text-cassette-red hover:underline ml-1"
            >
              Devlog
            </Link>
            — surfacing experimental entries or visual dev snapshots.
          </p>
        </section>

        {/* Future stub */}
        <div className="pt-10 border-t border-zinc-800">
          <p className="text-gray-500 text-sm">
            🚧 Future: dynamic “dev-scrapbook” view pulling commits, MDX notes, and
            AI-generated experiments.
          </p>
        </div>
      </div>
    </main>
  );
}
