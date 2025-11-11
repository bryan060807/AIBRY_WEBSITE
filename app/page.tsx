"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const LatestRelease = dynamic(() => import("./sections/LatestRelease"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});
const VideoGallery = dynamic(() => import("./sections/VideoGallery"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

const artistSchema = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  name: "AIBRY",
  genre: ["Metal", "Trapmetal", "Dark Trap"],
  description:
    "AIBRY is the sound of unfiltered emotion – a fusion of metal, trapmetal, and raw chaos. Explore music, visuals, and exclusive releases.",
  url: "https://aibry.shop",
  image: "https://aibry.shop/images/og-banner.jpg",
  sameAs: [
    "https://www.instagram.com/aibrymusic/",
    "https://www.tiktok.com/@_aibry",
    "https://open.spotify.com/artist/6gw6SIOYGPhuMqOfLwJE9h",
    "https://music.apple.com/us/artist/aibry/1830943798",
    "https://allmylinks.com/aibry",
  ],
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-gray-100">
      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(artistSchema) }}
      />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6 bg-gradient-to-b from-black via-gray-900 to-black">
        <Image
          src="/images/logo.png"
          alt="AIBRY Logo"
          width={220}
          height={220}
          priority
          className="mb-6 drop-shadow-[0_0_25px_rgba(131,192,204,0.5)]"
        />
        <h1 className="text-5xl md:text-6xl font-bold text-[#83c0cc] mb-4">
          Metal. Emotion. Chaos.
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mb-8">
          The official home of AIBRY – where darkness meets sound.
        </p>
        <Link
          href="https://open.spotify.com/artist/6gw6SIOYGPhuMqOfLwJE9h"
          target="_blank"
          className="bg-[#83c0cc] hover:bg-[#6eb5c0] text-black font-semibold px-8 py-3 rounded-lg transition-colors"
        >
          Listen Now
        </Link>
      </section>

      {/* Divider */}
      <div className="h-[2px] w-4/5 mx-auto my-16 bg-gradient-to-r from-transparent via-[#4cc9f0]/40 to-transparent shadow-[0_0_10px_#4cc9f0]/20" />

      {/* Latest Single Section */}
      <section className="py-24 bg-gradient-to-b from-black via-gray-900 to-black text-center">
        <h2 className="text-4xl font-semibold text-white mb-6">
          Latest Single: Burn the Echo
        </h2>
        <div className="flex justify-center">
          <iframe
            src="https://open.spotify.com/embed/track/5OKUHeuW8DLHp3YIlA6bwI?utm_source=generator"
            width="100%"
            height="380"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="max-w-2xl w-full rounded-xl shadow-lg border border-gray-700"
          ></iframe>
        </div>
      </section>

      {/* Divider */}
      <div className="h-[2px] w-4/5 mx-auto my-16 bg-gradient-to-r from-transparent via-[#4cc9f0]/40 to-transparent shadow-[0_0_10px_#4cc9f0]/20" />

      {/* Latest Album Section */}
      <LatestRelease
        imageSrc="/images/discography/fault-line-bloom.jpg"
        title="Fault Line Bloom"
        description="A haunting blend of emotion and distortion – AIBRY’s latest sonic eruption."
        links={[
          {
            name: "YouTube",
            href: "https://www.youtube.com/watch?v=BMv0DSq87lE&list=OLAK5uy_mLnPdMz9uvtSJC28MOniIn6lZ5Ycixedo",
          },
          {
            name: "Spotify",
            href: "https://open.spotify.com/artist/6gw6SIOYGPhuMqOfLwJE9h",
          },
          {
            name: "Apple Music",
            href: "https://music.apple.com/us/artist/aibry/1830943798",
          },
        ]}
      />

      {/* Divider */}
      <div className="h-[2px] w-4/5 mx-auto my-16 bg-gradient-to-r from-transparent via-[#4cc9f0]/40 to-transparent shadow-[0_0_10px_#4cc9f0]/20" />

      {/* The Sound of Surviving Section */}
      <section className="relative py-24 bg-gradient-to-t from-black via-gray-900 to-black text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-white mb-6">
            The Sound of Surviving
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            AIBRY creates unfiltered metal and trapmetal with raw emotion and
            honesty. Every track is a reflection of chaos, control, and catharsis.
          </p>
          <Link
            href="/about"
            className="text-[#83c0cc] hover:text-[#6eb5c0] underline underline-offset-4"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="h-[2px] w-4/5 mx-auto my-16 bg-gradient-to-r from-transparent via-[#4cc9f0]/40 to-transparent shadow-[0_0_10px_#4cc9f0]/20" />

      {/* Video Gallery Section */}
      <VideoGallery
        videos={[
          {
            src: "https://www.youtube.com/embed/e0RgNe3aJqM",
            title: "AIBRY Music Video",
          },
          {
            src: "https://www.youtube.com/embed/udzBpCnujmE",
            title: "AIBRY - Visual 1",
          },
          {
            src: "https://www.youtube.com/embed/he_8CDhStN4",
            title: "AIBRY - Visual 2",
          },
        ]}
      />

      {/* Divider */}
      <div className="h-[2px] w-4/5 mx-auto my-16 bg-gradient-to-r from-transparent via-[#4cc9f0]/40 to-transparent shadow-[0_0_10px_#4cc9f0]/20" />

      {/* Support Section */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-black text-center">
        <h2 className="text-3xl font-semibold text-white mb-6">Support the Sound</h2>
        <p className="text-gray-400 mb-8">
          Rep the movement. Grab exclusive AIBRY merch and join the chaos.
        </p>
        <Link
          href="https://aibry-merch.aibry.shop/"
          target="_blank"
          className="bg-[#83c0cc] hover:bg-[#6eb5c0] text-black font-semibold px-8 py-3 rounded-lg transition-colors"
        >
          Visit the Store
        </Link>
      </section>

      {/* Divider */}
      <div className="h-[2px] w-4/5 mx-auto my-16 bg-gradient-to-r from-transparent via-[#4cc9f0]/40 to-transparent shadow-[0_0_10px_#4cc9f0]/20" />

      {/* Social Section */}
      <section className="py-16 bg-black text-center">
        <h2 className="text-2xl font-semibold text-white mb-6">Follow AIBRY</h2>
        <div className="flex flex-wrap justify-center gap-5 text-[#83c0cc]">
          <Link href="https://www.instagram.com/aibrymusic/" target="_blank">
            Instagram
          </Link>
          <Link
            href="https://www.facebook.com/profile.php?id=61579129561083"
            target="_blank"
          >
            Facebook
          </Link>
          <Link href="https://www.tiktok.com/@_aibry" target="_blank">
            TikTok
          </Link>
          <Link
            href="https://discord.com/channels/1433362326177845331/143372248437293087"
            target="_blank"
          >
            Discord
          </Link>
          <Link href="https://allmylinks.com/aibry" target="_blank">
            AllMyLinks
          </Link>
        </div>
      </section>
    </main>
  );
}
