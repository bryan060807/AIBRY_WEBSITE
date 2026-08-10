import Link from "next/link";

const currentWork = [
  {
    title: "AIBRY Specialist Platform / Catalog OS",
    eyebrow: "Applied AI",
    status: "Active",
    description:
      "A governed specialist system for evidence-driven analysis, proposals, validation, and real catalog operations. Human authorization stays inside the loop.",
  },
  {
    title: "AIBRY Vision Bridge",
    eyebrow: "Vision Infrastructure",
    status: "Operational",
    description:
      "Request-driven camera observation for authorized GPT workflows, with bounded capture, private routing, and server-side credential isolation.",
  },
  {
    title: "Otis / Garage Admin",
    eyebrow: "Operator Systems",
    status: "Active",
    description:
      "The operator console and review-gated memory system used to inspect, understand, and safely manage the AIBRY garage infrastructure.",
  },
  {
    title: "Hopewell Winery Platform",
    eyebrow: "Client Platform",
    status: "In Development",
    description:
      "A real-world replacement platform spanning the public website, kitchen display workflows, Square POS integration, and future VinoShipper operations.",
  },
];

const establishedProducts = [
  {
    title: "LyricSync",
    description: "Lyric alignment and synchronized video-export workflow for finished songs.",
    href: "/apps#lyricsync",
  },
  {
    title: "TrackMaster",
    description: "Browser-based audio mastering, editing, export, and comparison workflows.",
    href: "/apps/trackmaster",
  },
  {
    title: "AppAutopsy",
    description: "AI-assisted technical and commercial reviews for live apps and public repositories.",
    href: "/apps",
  },
  {
    title: "AIBRY ID",
    description: "Shared identity and account access across the AIBRY ecosystem.",
    href: "/apps/aibry-id",
  },
  {
    title: "TaskMaster",
    description: "Project and task operations for active work across the lab.",
    href: "/apps/taskmaster",
  },
  {
    title: "ChordMaster",
    description: "Songwriting and chord workflow tooling for creative work.",
    href: "/apps/chordmaster",
  },
];

export default function HomePage() {
  return (
    <div className="bg-black text-gray-100">
      <section className="relative min-h-[620px] overflow-hidden border-b border-gray-900 md:min-h-[700px]">
        <div
          className="absolute inset-0 bg-cover bg-center lg:bg-[center_42%]"
          style={{ backgroundImage: "url('/images/aibry-labs-banner.png')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/38" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.72)_36%,rgba(0,0,0,0.28)_66%,rgba(0,0,0,0.08)_100%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/65 to-transparent"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex min-h-[620px] max-w-6xl items-center px-6 py-20 md:min-h-[700px] md:py-28">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.4em] text-[#83c0cc]">
              AIBRY Labs
            </p>

            <h1 className="text-5xl font-black uppercase tracking-tight text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.9)] md:text-7xl">
              Applied AI. Software Systems. Real-World Tools.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-200 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] md:text-xl">
              AIBRY Labs builds AI-assisted operator systems, software products,
              creative infrastructure, and practical platforms that are tested
              against real work — not just demos.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#current-work"
                className="rounded-full bg-[#83c0cc] px-6 py-3 font-semibold text-black shadow-[0_0_28px_rgba(131,192,204,0.18)] transition hover:bg-[#6eb5c0]"
              >
                See Current Work
              </a>
              <Link
                href="/apps"
                className="rounded-full border border-[#83c0cc]/70 bg-black/35 px-6 py-3 font-semibold text-[#a6dce5] backdrop-blur-sm transition hover:border-[#83c0cc] hover:bg-[#83c0cc]/10"
              >
                Explore Apps
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-900 bg-gray-950/70 px-6 py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#83c0cc]">
              Featured System
            </p>
            <h2 className="text-3xl font-bold text-white md:text-5xl">
              AIBRY Specialist Platform
            </h2>
            <p className="mt-5 text-lg leading-8 text-gray-300">
              The specialist platform has grown from a concept into an operational
              system: evidence is observed, proposals are bounded, human authority
              is explicit, and independent validation closes the loop.
            </p>
            <p className="mt-4 leading-7 text-gray-400">
              Catalog OS is one of the places that model is being used for real
              production work, including structured music-catalog operations and
              review-gated changes.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-800 bg-black shadow-[0_0_50px_rgba(131,192,204,0.12)]">
            <video
              className="aspect-video w-full bg-black object-contain"
              controls
              playsInline
              preload="metadata"
              aria-label="AIBRY Specialist Platform reveal commercial"
            >
              <source src="/ASOSreveal.mp4" type="video/mp4" />
              Your browser does not support embedded video. You can open the video directly at /ASOSreveal.mp4.
            </video>
          </div>
        </div>
      </section>

      <section id="current-work" className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#83c0cc]">
            Current Work
          </p>
          <h2 className="text-3xl font-bold text-white md:text-5xl">
            What the lab is actually building now
          </h2>
          <p className="mt-5 text-lg leading-8 text-gray-300">
            The current portfolio spans AI orchestration, private vision systems,
            infrastructure operations, and a real customer platform. These are the
            projects driving the lab forward right now.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {currentWork.map((project) => (
            <article
              key={project.title}
              className="rounded-2xl border border-gray-800 bg-gray-950/80 p-6 transition hover:border-[#83c0cc]/60 hover:bg-gray-900/90"
            >
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#83c0cc]">
                  {project.eyebrow}
                </span>
                <span className="rounded-full border border-[#83c0cc]/25 bg-[#83c0cc]/10 px-3 py-1 text-xs font-semibold text-[#b9e8ef]">
                  {project.status}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white">{project.title}</h3>
              <p className="mt-4 leading-7 text-gray-400">{project.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-gray-900 bg-gray-950/60 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#83c0cc]">
                Established Products
              </p>
              <h2 className="text-3xl font-bold text-white md:text-4xl">
                The tools still doing real work
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-300">
                Earlier AIBRY projects have not disappeared. The strongest ones now
                sit underneath the newer platform work as products, utilities, and
                shared infrastructure.
              </p>
            </div>
            <Link
              href="/apps"
              className="shrink-0 font-semibold text-[#83c0cc] transition hover:text-[#a6dce5]"
            >
              View the app directory →
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {establishedProducts.map((product) => (
              <Link
                key={product.href}
                href={product.href}
                className="rounded-2xl border border-gray-800 bg-black/70 p-5 transition hover:border-[#83c0cc]/60 hover:bg-gray-950"
              >
                <h3 className="text-xl font-bold text-white">{product.title}</h3>
                <p className="mt-3 leading-6 text-gray-400">{product.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-2 md:py-20">
        <div className="rounded-3xl border border-gray-800 bg-gray-950/70 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#83c0cc]">
            Music
          </p>
          <h2 className="mt-4 text-3xl font-bold text-white">The catalog is still part of AIBRY.</h2>
          <p className="mt-4 leading-7 text-gray-400">
            The main site now leads with the lab and its systems, while releases and
            listening remain organized through the Bandcamp-focused discography.
          </p>
          <Link
            href="/discography"
            className="mt-6 inline-block font-semibold text-[#83c0cc] transition hover:text-[#a6dce5]"
          >
            Open Bandcamp discography →
          </Link>
        </div>

        <div className="rounded-3xl border border-gray-800 bg-gray-950/70 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#83c0cc]">
            Work With AIBRY
          </p>
          <h2 className="mt-4 text-3xl font-bold text-white">Bring a real problem.</h2>
          <p className="mt-4 leading-7 text-gray-400">
            AIBRY is increasingly focused on systems that have to survive real users,
            real operations, and real constraints — from infrastructure to customer-facing products.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-full bg-[#83c0cc] px-6 py-3 font-semibold text-black transition hover:bg-[#6eb5c0]"
          >
            Start a Conversation
          </Link>
        </div>
      </section>
    </div>
  );
}
