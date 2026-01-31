"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react";

interface AudiobookPlayerProps {
  src: string;
}

export default function AudiobookPlayer({ src }: AudiobookPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 🔄 Watch for Chapter Changes
  // This ensures that when the 'src' prop updates, the player loads the new file
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load(); // Load the new chapter URL
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.log("Auto-play blocked or failed:", err));
      }
    }
  }, [src]); // Triggers every time a new chapter is selected

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipBack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 15; // Rewind 15 seconds
    }
  };

  return (
    <div className="w-full rounded-xl border border-gray-800 bg-gray-900 p-8 shadow-2xl">
      <audio 
        ref={audioRef} 
        src={src} 
        onEnded={() => setIsPlaying(false)}
        preload="auto"
      />
      
      <div className="flex flex-col items-center gap-6">
        {/* Visual Progress Bar (Static) */}
        <div className="h-1.5 w-full rounded-full bg-gray-800">
          <div className="h-full w-1/3 rounded-full bg-[var(--cassette-red)] transition-all" />
        </div>

        <div className="flex items-center gap-10">
          {/* Skip Back */}
          <button 
            onClick={skipBack}
            className="text-gray-500 hover:text-white transition-colors"
            title="Back 15 seconds"
          >
            <RotateCcw size={28} />
          </button>

          {/* Main Play/Pause */}
          <button
            onClick={togglePlay}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--cassette-red)] text-white shadow-[0_0_20px_rgba(230,57,70,0.4)] transition-transform hover:scale-110 active:scale-95"
          >
            {isPlaying ? (
              <Pause size={36} fill="currentColor" />
            ) : (
              <Play size={36} fill="currentColor" className="ml-1" />
            )}
          </button>

          {/* Volume Icon */}
          <div className="text-gray-500">
            <Volume2 size={28} />
          </div>
        </div>
        
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600 font-bold">
          High Fidelity Audio Stream
        </p>
      </div>
    </div>
  );
}