import Image from "next/image";
import Link from "next/link";
import { apps } from "@/lib/appCatalog";

const activeSystems = [
  {
    title: "AIBRY Specialist Platform / Catalog OS",
    label: "Applied AI",
    status: "Active",
    description:
      "A governed specialist system for evidence-driven analysis, bounded proposals, review-gated changes, and independent validation. Catalog OS is one of its real production uses.",
  },
  {
    title: "AIBRY Vision Bridge",
    label: "Vision Infrastructure",
    status: "Operational",
    description:
      "A request-driven observation bridge for authorized GPT workflows, with bounded capture, private routing, and server-side credential handling.",
  },
  {
    title: "Otis / Garage Admin",
    label: "Operator Systems",
    status: "Active",
    description:
      "The current operator console and memory system for inspecting and safely managing the AIBRY garage infrastructure.",
  },
  {
    title: "Hopewell Winery Platform",
    label: "Client Platform",
    status: "In Development",
    description:
      "A real customer platform spanning the public website, kitchen display workflows, Square POS integration, and future VinoShipper operations.",
  },
];

const statusClasses: Record<string, string> = {
  Live: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  Beta: "border-blue-500/30 bg-blue-500/10 text-blue-200",
  Experimental: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  Operator: "border-purple-500/30 bg-purple-500/10 text-purple-200",
  Focused: "border-[#83c0cc]/40 bg-[#83c0cc]/10 text-[#b6edf5]",
};

export const metadata = {
  title: "Apps & Systems | AIBRY Labs",
  description:
    "Explore the current AIBRY Labs portfolio: applied AI systems, operator infrastructure, creative software, and established products.",
};

export default function AppsPage() {
  return (
    <main className="min-h-screen bg-black text-gray-100">
      <section className="border-b border-gray-900 px-6 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.4em] text-[#83c0cc]">
            Apps & Systems
          </p>
          <h1 className="max-w-5xl text-5xl font-black uppercase tracking-tight text-white md:text-7xl">
            What AIBRY Builds
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-gray-300 md:text-xl">
            AIBRY Labs now spans more than standalone apps. The portfolio includes
            applied AI systems, private infrastructure, operator tools, creative
            software, and customer-facing platforms used in real work.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#83c0cc]">
            Current Platforms & Systems
          </p>
          <h2 className="text-3xl font-bold text-white md:text-5xl">
            The work driving the lab now
          </h2>
          <p className="mt-5 text-lg leading-8 text-gray-300">
            These projects represent the current direction of AIBRY Labs and the
            systems receiving the most active development and operational attention.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {activeSystems.map((system) => (
            <article
              key={system.title}
              className="rounded-2xl border border-gray-800 bg-gray-950/80 p-6 transition hover:border-[#83c0cc]/60 hover:bg-gray-900/90"
            >
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#83c0cc]">
                  {system.label}
                </span>
                <span className="rounded-full border border-[#83c0cc]/25 bg-[#83c0cc]/10 px-3 py-1 text-xs font-semibold text-[#b9e8ef]">
                  {system.status}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white">{system.title}</h3>
              <p className="mt-4 leading-7 text-gray-400">{system.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="lyricsync" className="border-y border-gray-900 bg-gray-950/60 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#83c0cc]">
                  Featured Tool
                </p>
                <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-200">
                  Private Tool
                </span>
              </div>
              <h2 className="text-4xl font-bold text-white md:text-5xl">LyricSync Pro</h2>
              <p className="mt-5 text-lg leading-8 text-gray-300">
                A production workstation for turning finished songs and lyric sheets into synchronized lyric videos.
              </p>
              <p className="mt-4 leading-7 text-gray-400">
                LyricSync combines bulk lyric intake, AI forced alignment, live tap sync, manual timing, visual styling, timeline editing, and server-side MP4 export in one workflow.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "AI forced align + live tap sync",
                  "Bulk lyric import",
                  "Typography and animation controls",
                  "4K H.264 server export",
                ].map((feature) => (
                  <div
                    key={feature}
                    className="rounded-xl border border-gray-800 bg-black/60 px-4 py-3 text-sm font-medium text-gray-300"
                  >
                    {feature}
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm leading-6 text-gray-500">
                Currently hosted privately inside the AIBRY network rather than exposed as a public web app.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-800 bg-black shadow-[0_0_55px_rgba(91,63,255,0.14)]">
              <Image
                src="/images/lyricsync/lyricsync-editor.webp"
                alt="LyricSync Pro editor showing synchronized lyrics, media preview, playback, and timing controls"
                width={1919}
                height={919}
                className="h-auto w-full"
              />
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="overflow-hidden rounded-2xl border border-gray-800 bg-black">
              <Image
                src="/images/lyricsync/lyricsync-sync-assistant.webp"
                alt="LyricSync Sync Assistant with AI Forced Align, Auto-Distribute, and Live Tap Sync"
                width={1916}
                height={914}
                className="h-auto w-full"
              />
            </div>
            <div className="overflow-hidden rounded-2xl border border-gray-800 bg-black">
              <Image
                src="/images/lyricsync/lyricsync-style-panel.webp"
                alt="LyricSync style controls for typography, animation, position, outline, shadow, and glow"
                width={1922}
                height={911}
                className="h-auto w-full"
              />
            </div>
            <div className="overflow-hidden rounded-2xl border border-gray-800 bg-black">
              <Image
                src="/images/lyricsync/lyricsync-server-export.webp"
                alt="LyricSync Server Export configured for 4K 16:9 H.264 rendering"
                width={1918}
                height={912}
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-900 bg-black px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#83c0cc]">
              Established Products
            </p>
            <h2 className="text-3xl font-bold text-white md:text-5xl">
              Public tools and core utilities
            </h2>
            <p className="mt-5 text-lg leading-8 text-gray-300">
              These products remain part of the AIBRY ecosystem and continue to
              support identity, productivity, music creation, and audio work.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {apps.map((app) => (
              <article
                key={app.slug}
                className="flex h-full flex-col rounded-2xl border border-gray-800 bg-black/70 p-6 transition hover:border-[#83c0cc]/60 hover:bg-gray-950"
              >
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
                    {app.role}
                  </span>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                      statusClasses[app.status] ?? "border-gray-700 bg-gray-800 text-gray-300"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white">{app.name}</h3>
                <p className="mt-2 font-medium text-[#83c0cc]">{app.tagline}</p>
                <p className="mt-4 flex-1 leading-7 text-gray-400">{app.summary}</p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {app.slug === "lyricsync" ? (
                    <a
                      href="#lyricsync"
                      className="font-semibold text-[#83c0cc] transition hover:text-[#a6dce5]"
                    >
                      View showcase ↑
                    </a>
                  ) : app.slug !== "app-autopsy" ? (
                    <Link
                      href={`/apps/${app.slug}`}
                      className="font-semibold text-[#83c0cc] transition hover:text-[#a6dce5]"
                    >
                      Project details →
                    </Link>
                  ) : null}
                  {app.href ? (
                    <a
                      href={app.href}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-gray-300 transition hover:text-white"
                    >
                      Open app ↗
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="rounded-3xl border border-gray-800 bg-gray-950/70 p-8 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#83c0cc]">
            Build With AIBRY
          </p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h2 className="text-3xl font-bold text-white md:text-4xl">
                Have a real operational problem?
              </h2>
              <p className="mt-4 max-w-3xl leading-7 text-gray-400">
                The lab is increasingly focused on systems that have to survive real
                users, real infrastructure, and real constraints — not one-off demos.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex rounded-full bg-[#83c0cc] px-6 py-3 font-semibold text-black transition hover:bg-[#6eb5c0]"
            >
              Start a Conversation
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
