"use client"; // Required for interactivity
import { useState } from "react";
import Image from "next/image";
import AudiobookPlayer from "@/components/AudiobookPlayer";

const CHAPTERS = [
  { id: 1, title: "Chapter 1", url: "https://u1ghapomlq4xkvj9.public.blob.vercel-storage.com/Chapter%201.mp3" },
  { id: 2, title: "Chapter 2", url: "https://u1ghapomlq4xkvj9.public.blob.vercel-storage.com/Chapter%202.mp3" },
  { id: 3, title: "Chapter 3", url: "https://u1ghapomlq4xkvj9.public.blob.vercel-storage.com/Chapter%203.mp3" },
  { id: 4, title: "Chapter 4", url: "https://u1ghapomlq4xkvj9.public.blob.vercel-storage.com/Chapter%204.mp3" },
  { id: 5, title: "Chapter 5", url: "https://u1ghapomlq4xkvj9.public.blob.vercel-storage.com/Chapter%205.mp3" },
  { id: 6, title: "Chapter 6", url: "https://u1ghapomlq4xkvj9.public.blob.vercel-storage.com/Chapter%206.mp3" },
  { id: 7, title: "Chapter 7", url: "https://u1ghapomlq4xkvj9.public.blob.vercel-storage.com/Chapter%207.mp3" },
  { id: 8, title: "Chapter 8", url: "https://u1ghapomlq4xkvj9.public.blob.vercel-storage.com/Chapter%208.mp3" },
  { id: 9, title: "Chapter 9", url: "https://u1ghapomlq4xkvj9.public.blob.vercel-storage.com/Chapter%209.mp3" },
  { id: 10, title: "Chapter 10", url: "https://u1ghapomlq4xkvj9.public.blob.vercel-storage.com/Chapter%2010.mp3" },
  { id: 11, title: "Chapter 11", url: "https://u1ghapomlq4xkvj9.public.blob.vercel-storage.com/Chapter%2011.mp3" },
  { id: 12, title: "Chapter 12", url: "hhttps://u1ghapomlq4xkvj9.public.blob.vercel-storage.com/Chapter%2012.mp3" },
  { id: 13, title: "Chapter 13", url: "https://u1ghapomlq4xkvj9.public.blob.vercel-storage.com/Chapter%2013.mp3" },
  { id: 14, title: "Chapter 14", url: "https://u1ghapomlq4xkvj9.public.blob.vercel-storage.com/Chapter%2014.mp3" },
];

export default function AudiobookPage() {
  // Start with Chapter 1 as the default
  const [currentChapter, setCurrentChapter] = useState(CHAPTERS[0]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="mb-2 text-4xl font-bold text-white uppercase tracking-tighter">
        The AIBRY Audiobook
      </h1>
      <p className="mb-10 text-gray-400">Now Playing: {currentChapter.title}</p>

      <div className="mb-12 flex justify-center">
        <div className="relative h-64 w-64 overflow-hidden rounded-lg shadow-2xl ring-1 ring-white/10">
          <Image
            src="/images/audiobook-cover.jpg"
            alt="Audiobook Cover"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* The Player now receives the URL of the selected chapter */}
      <AudiobookPlayer src={currentChapter.url} />

      <section className="mt-16 text-left border-t border-gray-800 pt-10">
        <h2 className="text-2xl font-semibold text-white mb-6">Select a Chapter</h2>
        <div className="grid gap-3">
          {CHAPTERS.map((chapter) => (
            <button
              key={chapter.id}
              onClick={() => setCurrentChapter(chapter)}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                currentChapter.id === chapter.id
                  ? "bg-gray-800 border-[var(--cassette-red)] shadow-[0_0_10px_rgba(230,57,70,0.2)]"
                  : "bg-gray-900/50 border-gray-800 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`${currentChapter.id === chapter.id ? "text-[var(--cassette-red)]" : "text-gray-500"} font-mono`}>
                  {chapter.id.toString().padStart(2, '0')}
                </span>
                <span className={currentChapter.id === chapter.id ? "text-white font-bold" : "text-gray-300"}>
                  {chapter.title}
                </span>
              </div>
              {currentChapter.id === chapter.id && (
                <span className="text-[var(--cassette-red)] text-xs font-bold uppercase">Playing</span>
              )}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}