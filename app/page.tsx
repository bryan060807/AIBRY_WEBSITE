import Image from "next/image";

export const metadata = {
  title: "AIBRY",
  description: "Welcome to my official website — music and merch.",
};

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 text-center">
      {/* Logo Hero */}
      <div className="mb-10 flex justify-center">
        <Image
          src="/images/logo.png"
          alt="AIBRY Logo"
          width={400}
          height={400}
          priority
        />
      </div>

      <p className="mb-12 text-lg text-gray-300">
        Welcome to my website — the official hub for my music and merch.
      </p>

      {/* Music Links */}
      <div className="mb-16 flex flex-wrap justify-center gap-4">
        <a
          href="https://soundcloud.com/bryan-miller-27"
          target="_blank"
          rel="noopener noreferrer"
          className="btn soundcloud"
        >
          <Image src="/icons/soundcloud.svg" alt="SoundCloud" width={20} height={20} />
          SoundCloud
        </a>
        <a
          href="https://www.youtube.com/channel/UCQDPCw7xwl3sQWjUjtnL1AQ"
          target="_blank"
          rel="noopener noreferrer"
          className="btn youtube"
        >
          <Image src="/icons/youtube.svg" alt="YouTube" width={20} height={20} />
          YouTube
        </a>
        <a
          href="https://music.apple.com/us/artist/aibry/1830943798"
          target="_blank"
          rel="noopener noreferrer"
          className="btn apple"
        >
          <Image src="/icons/apple.svg" alt="Apple Music" width={20} height={20} />
          Apple Music
        </a>
        <a
          href="https://open.spotify.com/artist/6gw6SIOYGPhuMqOfLwJE9h"
          target="_blank"
          rel="noopener noreferrer"
          className="btn spotify"
        >
          <Image src="/icons/spotify.svg" alt="Spotify" width={20} height={20} />
          Spotify
        </a>
        <a
          href="https://aibry.bandcamp.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn bandcamp"
        >
          <Image src="/icons/bandcamp.svg" alt="Bandcamp" width={20} height={20} />
          Bandcamp
        </a>
      </div>

      {/* Merch Preview */}
      <section className="mt-20 rounded-lg border border-gray-800 bg-gray-900 p-8 shadow-lg">
        <h2 className="mb-4 text-2xl font-semibold text-white">Official Merch</h2>
        <p className="mb-6 text-gray-400">
          New shirts, hoodies, and more available now. Rep AIBRY everywhere you go.
        </p>
        <a
          href="/merch"
          className="inline-block rounded bg-[#629aa9] px-6 py-3 font-semibold text-white transition hover:bg-[#4f7f86]"
        >
          Visit Merch Store
        </a>
      </section>
    </main>
  );
}
