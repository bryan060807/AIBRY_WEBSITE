import Link from "next/link";

export default function LocalTownRunnersSpotlight() {
  return (
    <section
      id="local-town-runners"
      aria-labelledby="local-town-runners-heading"
      className="scroll-mt-24 border-b border-gray-900 bg-gray-950/70 px-6 py-16 md:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-[#83c0cc]" aria-hidden="true" />
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#83c0cc]">
            Project Spotlight
          </p>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2
              id="local-town-runners-heading"
              className="text-4xl font-bold tracking-tight text-white md:text-5xl"
            >
              Local Town Runners
            </h2>
            <p className="mt-5 text-lg leading-8 text-gray-300">
              Your neighbor is already going that way.
            </p>
            <p className="mt-4 leading-7 text-gray-400">
              Born from the PayPal AI Hackathon and inspired by small-town life,
              Local Town Runners explores a marketplace connecting local shops,
              customers, and neighbors whose everyday trips could carry an order.
            </p>
            <p className="mt-4 text-sm leading-6 text-gray-400">
              A community commerce prototype with fictional demo shopping and
              PayPal Sandbox payments.
            </p>
            <Link
              href="/apps/local-town-runners"
              className="mt-6 inline-flex font-semibold text-[#a6dce5] underline decoration-[#83c0cc]/40 underline-offset-4 hover:text-white"
            >
              Small towns. Big possibilities. Read the story →
            </Link>
            <a
              href="https://www.youtube.com/watch?v=3_TTpw0K51g"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#83c0cc]/60 px-5 py-3 font-semibold text-[#a6dce5] transition hover:border-[#83c0cc] hover:bg-[#83c0cc]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#83c0cc]"
            >
              Watch on YouTube <span aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>

          <figure className="min-w-0">
            <div className="overflow-hidden rounded-2xl border border-gray-800 bg-black shadow-[0_0_50px_rgba(131,192,204,0.12)]">
              <iframe
                src="https://www.youtube-nocookie.com/embed/3_TTpw0K51g"
                title="Local Town Runners — project spotlight video"
                className="aspect-video h-auto w-full border-0"
                width="560"
                height="315"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <figcaption className="mt-3 text-sm leading-6 text-gray-500">
              Meet Local Town Runners. Play the video here or open it on YouTube.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
