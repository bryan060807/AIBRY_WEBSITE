import Link from "next/link";
import { getAppBySlug } from "@/lib/appCatalog";

const app = getAppBySlug("chordmaster");

export const metadata = {
  title: "ChordMaster | AIBRY Apps",
  description: "ChordMaster app overview inside the AIBRY app ecosystem.",
};

export default function ChordMasterPage() {
  if (!app) return null;

  return (
    <main className="min-h-screen bg-black text-gray-100">
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <Link href="/apps" className="text-sm font-semibold text-[#83c0cc] hover:text-white">
          ← Back to Apps
        </Link>
        <div className="mt-8 rounded-3xl border border-gray-800 bg-gray-950/70 p-8 md:p-10">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
              {app.status}
            </span>
            <span className="text-sm uppercase tracking-[0.25em] text-gray-500">{app.role}</span>
          </div>
          <h1 className="text-4xl font-black text-white md:text-6xl">{app.name}</h1>
          <p className="mt-4 text-xl font-medium text-[#83c0cc]">{app.tagline}</p>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-400">{app.summary}</p>
          <a
            href={app.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-full bg-[#83c0cc] px-6 py-3 font-semibold text-black transition hover:bg-[#6eb5c0]"
          >
            Open App
          </a>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-20 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-800 bg-black/70 p-6">
          <h2 className="mb-4 text-2xl font-bold text-white">Features</h2>
          <ul className="space-y-3 text-gray-400">
            {app.features.map((feature) => (
              <li key={feature}>• {feature}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-gray-800 bg-black/70 p-6">
          <h2 className="mb-4 text-2xl font-bold text-white">Stack / Role</h2>
          <div className="flex flex-wrap gap-2">
            {app.stack.map((item) => (
              <span key={item} className="rounded-full border border-gray-700 px-3 py-1 text-sm text-gray-300">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
