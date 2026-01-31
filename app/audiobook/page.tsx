import Image from "next/image";
import AudiobookPlayer from "@/components/AudiobookPlayer";

export const metadata = {
  title: "Audiobook",
  description: "Listen to the official AIBRY audiobook.",
};

export default function AudiobookPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="mb-2 text-4xl font-bold text-white uppercase tracking-tighter">
        The Audiobook
      </h1>
      <p className="mb-10 text-gray-400">Experience the story behind the sound.</p>

      <div className="mb-12 flex justify-center">
        <div className="relative h-80 w-80 overflow-hidden rounded-lg shadow-2xl ring-1 ring-white/10">
          <Image
            src="/images/audiobook-cover.jpg" // Ensure you add this image
            alt="Audiobook Cover"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Custom Player */}
      <AudiobookPlayer src="https://your-storage-link.com/audiobook.mp3" />

      <section className="mt-16 text-left border-t border-gray-800 pt-10">
        <h2 className="text-2xl font-semibold text-white mb-4">Chapter List</h2>
        <ul className="space-y-3 text-gray-300">
          <li className="flex justify-between border-b border-gray-800 pb-2">
            <span>01. The Beginning</span>
            <span className="text-gray-500">12:45</span>
          </li>
          {/* Add more chapters as needed */}
        </ul>
      </section>
    </main>
  );
}