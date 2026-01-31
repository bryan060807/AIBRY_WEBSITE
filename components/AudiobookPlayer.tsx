"use client";
import { useState, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react"; // Install lucide-react or use SVGs

export default function AudiobookPlayer({ src }: { src: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">
      <audio ref={audioRef} src={src} onEnded={() => setIsPlaying(false)} />
      
      <div className="flex flex-col items-center gap-6">
        {/* Progress Bar Placeholder - Can be expanded with a range input */}
        <div className="h-1.5 w-full rounded-full bg-gray-800">
          <div className="h-full w-1/3 rounded-full bg-[var(--cassette-red)]" />
        </div>

        <div className="flex items-center gap-8">
          <button 
            onClick={() => (audioRef.current!.currentTime -= 15)}
            className="text-gray-400 hover:text-white transition"
          >
            <RotateCcw size={24} />
          </button>

          <button
            onClick={togglePlay}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--cassette-red)] text-white shadow-lg transition hover:scale-105"
          >
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>

          <div className="text-gray-400">
            <Volume2 size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}