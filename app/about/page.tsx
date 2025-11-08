"use client";

import HeadTags from "@/components/ui/HeadTags";
import Image from "next/image";
import Link from "next/link";

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  name: "AIBRY",
  genre: ["Metal", "Trapmetal", "Dark Trap"],
  description:
    "A deeper look at AIBRY — an artist forging raw emotion into sound. Metal. Emotion. Chaos.",
  url: "https://aibry.shop/about",
  image: "https://aibry.shop/images/banner1.jpg",
  sameAs: [
    "https://www.instagram.com/aibrymusic/",
    "https://www.tiktok.com/@_aibry",
    "https://open.spotify.com/artist/6gw6SIOYGPhuMqOfLwJE9h",
    "https://music.apple.com/us/artist/aibry/1830943798",
    "https://allmylinks.com/aibry",
  ],
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-gray-100">
      {/* SEO Metadata */}
      <HeadTags
        title="About AIBRY | The Sound of Surviving"
        description="AIBRY creates unfiltered metal and trapmetal with raw emotion and unflinching honesty. Learn the story behind the sound."
        image="/images/banner1.jpg"
      />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />

      {/* About Hero */}
      <section className="relative py-24 bg-gradient-to-b from-black via-gray-900 to-black text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-bold text-[#83c0cc] mb-6">The Sound of Surviving</h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
            AIBRY began as a raw outlet — a collision between survival and self-expression.  
            Blending metal, trapmetal, and chaos, AIBRY transforms emotion into distortion and pain into art.
          </p>
        </div>
      </section>

      {/* Image + Bio */}
      <section className="py-16 bg-black border-t border-gray-800 flex flex-col md:flex-row items-center justify-center gap-10 px-8">
        <Image
          src="/images/about/about-photo.jpg"
          alt="AIBRY performing live"
          width={400}
          height={400}
          className="rounded-xl shadow-lg object-cover"
        />
        <div className="max-w-lg">
          <h2 className="text-3xl font-semibold text-white mb-4">More Than Music</h2>
          <p className="text-gray-400 mb-6 leading-relaxed">
            Every track is a reflection of chaos, control, and catharsis — 
            a fight between destruction and creation.  
            AIBRY stands for honesty in emotion, intensity in sound, and connection through darkness.
          </p>
          <p className="text-gray-400 mb-6 leading-relaxed">
            Whether screaming into distortion or whispering through a storm,  
            AIBRY’s art is survival — not spectacle.
          </p>
          <Link
            href="https://open.spotify.com/artist/6gw6SIOYGPhuMqOfLwJE9h"
            target="_blank"
            className="bg-[#83c0cc] hover:bg-[#6eb5c0] text-black font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Listen on Spotify
          </Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-t from-gray-900 to-black text-center border-t border-gray-800">
        <h2 className="text-3xl font-semibold text-white mb-4">Join the Movement</h2>
        <p className="text-gray-400 mb-8">
          Be part of something louder than pain — follow AIBRY and stay connected.
        </p>
        <div className="flex flex-wrap justify-center gap-5 text-[#83c0cc]">
          <Link href="https://www.instagram.com/aibrymusic/" target="_blank">
            Instagram
          </Link>
          <Link href="https://www.tiktok.com/@_aibry" target="_blank">
            TikTok
          </Link>
          <Link href="https://open.spotify.com/artist/6gw6SIOYGPhuMqOfLwJE9h" target="_blank">
            Spotify
          </Link>
          <Link href="https://music.apple.com/us/artist/aibry/1830943798" target="_blank">
            Apple Music
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black text-center py-6 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} AIBRY. Built for the broken and the bold.</p>
      </footer>
    </main>
  );
}
