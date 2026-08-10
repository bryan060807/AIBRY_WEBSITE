import Link from "next/link";
import { getAppBySlug } from "@/lib/appCatalog";

const app = getAppBySlug("garage-admin");

export const metadata = {
  title: "Otis / Garage Admin | AIBRY Labs",
  description: "Private operator console and review-gated memory system for the AIBRY garage infrastructure.",
};

export default function GarageAdminPage() {
  if (!app) return null;

  return (
    <main className="min-h-screen bg-black text-gray-100">
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <Link href="/apps" className="text-sm font-semibold text-[#83c0cc] hover:text-white">
          ← Back to Apps
        </Link>
        <div className="mt-8 rounded-3xl border border-gray-800 bg-gray-950/70 p-8 md:p-10">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-200">
              {app.status}
            </span>
            <span className="text-sm uppercase tracking-[0.25em] text-gray-500">{app.role}</span>
          </div>
          <h1 className="text-4xl font-black text-white md:text-6xl">{app.name}</h1>
          <p className="mt-4 text-xl font-medium text-[#83c0cc]">{app.tagline}</p>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-400">{app.summary}</p>
          <p className="mt-6 inline-flex rounded-full border border-gray-700 bg-black/60 px-4 py-2 text-sm font-semibold text-gray-300">
            Local-only operator surface — no public launch link.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-20 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-800 bg-black/70 p-6">
          <h2 className="mb-4 text-2xl font-bold text-white">Capabilities</h2>
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
