import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "About | AIBRY Labs",
  description:
    "AIBRY Labs is a working software and applied AI lab building operator systems, creative tools, infrastructure, and real-world client platforms.",
};

const principles = [
  {
    title: "Build for real work",
    description:
      "Projects are judged by whether they survive real users, real operations, and real constraints — not whether they only look good in a demo.",
  },
  {
    title: "Keep humans in authority",
    description:
      "AI-assisted systems should observe, propose, and validate without quietly taking irreversible control away from the people responsible for the work.",
  },
  {
    title: "Own the infrastructure",
    description:
      "AIBRY operates its own mix of Windows and Fedora infrastructure, private services, routing, storage, and application runtimes instead of treating deployment as an afterthought.",
  },
  {
    title: "Let projects teach the next project",
    description:
      "Audio tools, identity, task systems, operator consoles, vision bridges, and customer platforms all feed lessons back into the shared architecture of the lab.",
  },
];

const areas = [
  "Applied AI and specialist systems",
  "Operator and infrastructure tooling",
  "Creative and audio software",
  "Identity and productivity products",
  "Customer-facing platforms",
  "Music and catalog operations",
];

export default function AboutPage() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AIBRY Labs",
    url: "https://aibrylabs.com",
    description:
      "AIBRY Labs builds applied AI systems, operator infrastructure, creative software, and real-world client platforms.",
  };

  return (
    <main className="min-h-screen bg-black text-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <section className="relative overflow-hidden border-b border-gray-900 px-6 py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(131,192,204,0.18),_transparent_34rem)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.4em] text-[#83c0cc]">
              About AIBRY Labs
            </p>
            <h1 className="max-w-4xl text-5xl font-black uppercase tracking-tight text-white md:text-7xl">
              A Working Lab for Software, AI, and Systems
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-gray-300 md:text-xl">
              AIBRY Labs is a hands-on software and applied AI lab built around a
              simple idea: useful systems come from doing real work with them.
            </p>
            <p className="mt-5 max-w-3xl leading-8 text-gray-400">
              What began with music and creative software has grown into a broader
              ecosystem of identity, productivity, audio tools, operator systems,
              private infrastructure, AI-assisted workflows, and customer-facing
              platforms.
            </p>
          </div>

          <div className="mx-auto w-full max-w-sm rounded-3xl border border-gray-800 bg-gray-950/80 p-8 text-center shadow-[0_0_60px_rgba(131,192,204,0.12)]">
            <Image
              src="/images/logo.png"
              alt="AIBRY Labs logo"
              width={180}
              height={180}
              priority
              className="mx-auto h-40 w-40 rounded-full object-contain shadow-[0_0_35px_rgba(131,192,204,0.2)]"
            />
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-[#83c0cc]">
              Built from the garage
            </p>
            <p className="mt-3 text-2xl font-bold text-white">
              Practical systems over polished demos.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#83c0cc]">
              What AIBRY Is Now
            </p>
            <h2 className="text-3xl font-bold text-white md:text-5xl">
              One lab, several kinds of systems
            </h2>
          </div>
          <div>
            <p className="text-lg leading-8 text-gray-300">
              The current work crosses traditional product boundaries. AIBRY builds
              public applications, internal operator tools, AI-assisted systems,
              infrastructure services, and complete platforms for outside organizations.
            </p>
            <p className="mt-5 leading-8 text-gray-400">
              The common thread is ownership of the full problem: interface, backend,
              data, deployment, operations, and the process people use around the software.
              That is why the lab now looks less like a collection of unrelated apps and
              more like a connected operating environment for building and running useful systems.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => (
            <div
              key={area}
              className="rounded-2xl border border-gray-800 bg-gray-950/70 px-5 py-4 font-medium text-gray-300"
            >
              {area}
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-gray-900 bg-gray-950/60 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#83c0cc]">
              How the Lab Works
            </p>
            <h2 className="text-3xl font-bold text-white md:text-5xl">
              Principles that shape the projects
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {principles.map((principle) => (
              <article
                key={principle.title}
                className="rounded-2xl border border-gray-800 bg-black/70 p-6"
              >
                <h3 className="text-2xl font-bold text-white">{principle.title}</h3>
                <p className="mt-4 leading-7 text-gray-400">{principle.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-gray-800 bg-gray-950/70 p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#83c0cc]">
              See the Work
            </p>
            <h2 className="mt-4 text-3xl font-bold text-white">
              Explore the current portfolio.
            </h2>
            <p className="mt-4 leading-7 text-gray-400">
              The apps and systems directory separates the active platform work from
              the established products that continue to serve the wider ecosystem.
            </p>
            <Link
              href="/apps"
              className="mt-6 inline-block font-semibold text-[#83c0cc] transition hover:text-[#a6dce5]"
            >
              View Apps & Systems →
            </Link>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-950/70 p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#83c0cc]">
              Work With AIBRY
            </p>
            <h2 className="mt-4 text-3xl font-bold text-white">
              Bring a problem worth solving.
            </h2>
            <p className="mt-4 leading-7 text-gray-400">
              AIBRY is most useful when software has to connect to the real operation
              around it — people, infrastructure, data, workflows, and constraints.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-block rounded-full bg-[#83c0cc] px-6 py-3 font-semibold text-black transition hover:bg-[#6eb5c0]"
            >
              Start a Conversation
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
