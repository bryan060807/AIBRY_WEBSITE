"use client";

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-gray-100">
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
          The official home of AIBRY — where darkness meets sound.
        </p>
        <Link
          href="https://open.spotify.com/artist/6gw6SIOYGPhuMqOfLwJE9h"
          target="_blank"
          className="bg-[#83c0cc] hover:bg-[#6eb5c0] text-black font-semibold px-8 py-3 rounded-lg transition-colors"
        >
          Listen Now
        </Link>
      </section>

      {/* Live Review Clip Section */}
      <section className="py-16 bg-black border-t border-gray-800 text-center">
        <h2 className="text-3xl font-semibold text-white mb-8">
          Live Review: <span className="text-[#83c0cc]">AIBRY on Stream</span>
        </h2>
        <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg border border-gray-800">
          <div className="relative pb-[56.25%] h-0">
            <iframe
              src="https://www.youtube.com/embed/Z38Mjfj3Owo?si=UXdKVtN01OoNOlhr&amp;clip=Ugkx4_SbgyZ7bbQBno-UCeK1RaK-zF2PmMD8&amp;clipt=EPjMgQIY3PyCAg"
              title="AIBRY - Live Review Clip"
              className="absolute top-0 left-0 w-full h-full"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Featured Release */}
      <section className="py-24 bg-black border-t border-gray-800 text-center">
        <h2 className="text-3xl font-semibold text-white mb-8">Latest Release</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <Image
            src="/images/discography/fault-line-bloom.jpg"
            alt="Fault Line Bloom Cover Art"
            width={280}
            height={280}
            className="rounded-xl shadow-lg"
          />
          <div className="max-w-md text-left">
            <h3 className="text-2xl font-semibold mb-3 text-[#83c0cc]">&quot;Fault Line Bloom&quot;</h3>
            <p className="text-gray-400 mb-6">
              A haunting blend of emotion and distortion — AIBRY’s latest sonic eruption.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                href="https://www.youtube.com/watch?v=BMv0DSq87lA&list=OLAK5uy_mLnpdMz9uvtSJC28MOniln6lZ5Ycixedo"
                target="_blank"
                className="px-5 py-2 rounded bg-[#83c0cc] hover:bg-[#6eb5c0] text-black font-semibold"
              >
                Watch on YouTube
              </Link>
              <Link
                href="https://open.spotify.com/artist/6gw6SIOYGPhuMqOfLwJE9h"
                target="_blank"
                className="px-5 py-2 rounded border border-[#83c0cc] hover:bg-[#83c0cc]/10 transition-colors"
              >
                Spotify
              </Link>
              <Link
                href="https://music.apple.com/us/artist/aibry/1830943798"
                target="_blank"
                className="px-5 py-2 rounded border border-[#83c0cc] hover:bg-[#83c0cc]/10 transition-colors"
              >
                Apple Music
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative py-24 bg-gradient-to-t from-black via-gray-900 to-black text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-white mb-6">The Sound of Surviving</h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            AIBRY creates unfiltered metal and trapmetal with raw emotion and unflinching honesty.
            Every track is a reflection of chaos, control, and catharsis.
          </p>
          <Link
            href="/about"
            className="text-[#83c0cc] hover:text-[#6eb5c0] underline underline-offset-4"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Latest Visuals */}
      <section className="py-24 bg-black border-t border-gray-800">
        <h2 className="text-3xl font-semibold text-white text-center mb-10">Latest Visuals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6">
          <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/e0RgNe3aJqM"
              title="AIBRY Music Video"
              className="w-full h-full"
              allowFullScreen
            />
          </div>
          <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center text-gray-600">
            <p>More coming soon...</p>
          </div>
          <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center text-gray-600">
            <p>More coming soon...</p>
          </div>
        </div>
      </section>

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

      {/* Social Section */}
      <section className="py-16 bg-black border-t border-gray-800 text-center">
        <h2 className="text-2xl font-semibold text-white mb-6">Follow AIBRY</h2>
        <div className="flex flex-wrap justify-center gap-5 text-[#83c0cc]">
          <Link href="https://www.instagram.com/aibrymusic/" target="_blank">Instagram</Link>
          <Link href="https://www.facebook.com/profile.php?id=61579129561083" target="_blank">Facebook</Link>
          <Link href="https://www.tiktok.com/@_aibry" target="_blank">TikTok</Link>
          <Link href="https://discord.com/channels/1433362326177845331/143372248437293087" target="_blank">Discord</Link>
          <Link href="https://allmylinks.com/aibry" target="_blank">AllMyLinks</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black text-center py-6 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} AIBRY. Built for the broken and the bold.</p>
      </footer>
    </main>
  );
}
