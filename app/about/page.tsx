import Image from "next/image";

export const metadata = {
  title: "About | AIBRY",
  description: "Learn more about AIBRY and the music behind the name.",
};

export default function AboutPage() {
  return (
    <main className="relative mx-auto max-w-4xl px-4 py-12">
      {/* Background Watermark */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-5"
        aria-hidden="true"
      >
        <Image
          src="/images/logo.png"
          alt=""
          width={800}
          height={800}
          className="w-3/4 max-w-lg object-contain"
        />
      </div>

      {/* Banner Image */}
      <section
        className="relative mb-10 w-full overflow-hidden rounded-lg shadow-lg"
        aria-label="AIBRY artistic banner portrait"
      >
        <Image
          src="/images/about/throne.jpg"
          alt="AIBRY artistic portrait on a throne"
          width={1200}
          height={800}
          className="w-full rounded-lg object-contain"
          priority
        />
      </section>

      {/* Main Bio Section */}
      <section className="relative z-10 text-center">
        <h1 className="mb-6 text-3xl font-bold text-gray-100">About AIBRY</h1>
        <p className="mb-6 text-lg text-gray-200 leading-relaxed">
          AIBRY is a project born out of raw emotion and storytelling. My music
          blends heavy riffs, dark atmospheres, and melodic hooks — always
          aiming to connect with listeners on a deeper level. Each track is a
          piece of my journey, carrying both the scars and the hope that define
          who I am.
        </p>
        <h2 className="mt-10 mb-4 text-2xl font-semibold text-gray-100">
          The Mission
        </h2>
        <p className="text-lg text-gray-200 leading-relaxed">
          This site is the hub for everything AIBRY: music, merch, and updates.
          Thanks for listening and being part of the story.
        </p>
      </section>

      {/* Secondary Portrait */}
      <section
        className="relative z-10 mt-12 flex justify-center"
        aria-label="AIBRY shadow portrait"
      >
        <div className="w-full max-w-md overflow-hidden rounded-lg shadow-lg">
          <Image
            src="/images/about/shadow-portrait.jpg"
            alt="AIBRY shadow portrait"
            width={600}
            height={800}
            className="w-full object-cover"
          />
        </div>
      </section>
    </main>
  );
}
