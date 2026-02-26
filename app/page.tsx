"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

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
    "https://music.apple.com/us/artist/aibry/1830943798",
    "https://allmylinks.com/aibry",
  ],
};

export default function HomePage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Target date: February 28, 2026
    const targetDate = new Date("2026-02-28T00:00:00").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
          href="https://allmylinks.com/aibry"
          target="_blank"
          className="bg-[#83c0cc] hover:bg-[#6eb5c0] text-black font-semibold px-8 py-3 rounded-lg transition-colors"
        >
          Stream Music
        </Link>
      </section>

      {/* Divider */}
      <div className="h-[2px] w-4/5 mx-auto my-16 bg-gradient-to-r from-transparent via-[#4cc9f0]/40 to-transparent shadow-[0_0_10px_#4cc9f0]/20" />

      {/* Upcoming Album Section with Countdown */}
      <section className="py-24 bg-gradient-to-b from-black via-gray-900 to-black text-center">
        <h2 className="text-4xl font-bold text-white mb-2 uppercase tracking-tighter">
          Upcoming Album
        </h2>
        <p className="text-2xl text-[#83c0cc] font-semibold mb-10">
          The Echo Integration
        </p>

        {/* Countdown Timer Visual */}
        <div className="flex justify-center gap-4 mb-12">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Min", value: timeLeft.minutes },
            { label: "Sec", value: timeLeft.seconds },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center min-w-[70px]">
              <div className="text-4xl md:text-5xl font-bold text-white tabular-nums">
                {String(item.value).padStart(2, "0")}
              </div>
              <div className="text-xs uppercase tracking-widest text-[#83c0cc] font-bold">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center">
          <Image
            src="/images/echo.jpg"
            alt="The Echo Integration Album Art"
            width={400}
            height={400}
            className="rounded-2xl shadow-[0_0_40px_rgba(131,192,204,0.4)] border border-gray-700 mb-8 transition-transform hover:scale-[1.02]"
          />
          <div className="flex flex-wrap justify-center gap-4">
            <span className="bg-gray-800 text-gray-400 font-semibold px-6 py-3 rounded-xl border border-gray-700 cursor-default">
              Presave Coming Soon
            </span>
            <Link
              href="https://allmylinks.com/aibry"
              target="_blank"
              className="bg-transparent border border-[#83c0cc] text-[#83c0cc] hover:bg-[#83c0cc] hover:text-black font-semibold px-6 py-3 rounded-xl transition-all"
            >
              Get Notified
            </Link>
          </div>
        </div>
      </section>

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
          { src: "https://www.youtube.com/embed/tZfnAs9eloA", title: "AIBRY Visual 1" },
          { src: "https://www.youtube.com/embed/jEXTP-xYLNA", title: "AIBRY Visual 2" },
          { src: "https://www.youtube.com/embed/UsBiI6AcS2Y", title: "AIBRY Visual 3" },
        ]}
      />

      {/* Divider */}
      <div className="h-[2px] w-4/5 mx-auto my-16 bg-gradient-to-r from-transparent via-[#4cc9f0]/40 to-transparent shadow-[0_0_10px_#4cc9f0]/20" />

      {/* Social Section */}
      <section className="py-24 bg-black text-center">
        <h2 className="text-3xl font-semibold text-white mb-10">Follow AIBRY</h2>
        <div className="flex flex-wrap justify-center gap-8 text-[#83c0cc] text-lg">
          <Link href="https://www.instagram.com/aibrymusic/" target="_blank" className="hover:text-white transition-colors">Instagram</Link>
          <Link href="https://www.facebook.com/profile.php?id=61579129561083" target="_blank" className="hover:text-white transition-colors">Facebook</Link>
          <Link href="https://www.tiktok.com/@_aibry" target="_blank" className="hover:text-white transition-colors">TikTok</Link>
          <Link href="https://discord.com/channels/1433362326177845331/143372248437293087" target="_blank" className="hover:text-white transition-colors">Discord</Link>
          <Link href="https://allmylinks.com/aibry" target="_blank" className="hover:text-white transition-colors">AllMyLinks</Link>
        </div>
      </section>
    </main>
  );
}