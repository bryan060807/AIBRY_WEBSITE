"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";

export default function AudiobookPlayer({ src }: { src: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8); // Default 80% volume
  const audioRef = useRef<HTMLAudioElement>(null);

  // Sync state with actual audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set initial volume on mount
    audio.volume = volume;

    const setPlay = () => setIsPlaying(true);
    const setPause = () => setIsPlaying(false);

    audio.addEventListener('play', setPlay);
    audio.addEventListener('pause', setPause);

    return () => {
      audio.removeEventListener('play', setPlay);
      audio.removeEventListener('pause', setPause);
    };
    // Added 'volume' to dependency array to satisfy ESLint
  }, [volume]);

  // Force reload and sync volume when src changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.load();
      audio.volume = volume; 
      if (isPlaying) {
        audio.play().catch(e => console.error("Playback failed", e));
      }
    }
    // Added 'isPlaying' and 'volume' to dependency array to ensure consistent 
    // behavior when switching chapters
  }, [src, isPlaying, volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="w-full rounded-xl border border-gray-800 bg-gray-900 p-8 shadow-2xl">
      <audio ref={audioRef} src={src} preload="auto" />
      
      <div className="flex flex-col items-center gap-8">
        {/* Playback Progress Indicator */}
        <div className="h-1.5 w-full rounded-full bg-gray-800 overflow-hidden">
          <div 
            className={`h-full bg-[var(--cassette-red)] transition-all duration-300 ${
              isPlaying ? 'w-1/2 opacity-100' : 'w-0 opacity-50'
            }`} 
          />
        </div>

        <div className="flex w-full flex-col items-center justify-between gap-8 md:flex-row">
          
          {/* Playback Controls */}
          <div className="flex items-center gap-8 flex-1 justify-center">
            <button 
              onClick={() => { if(audioRef.current) audioRef.current.currentTime -= 15 }} 
              className="text-gray-500 hover:text-white transition-colors"
              aria-label="Skip back 15 seconds"
            >
              <RotateCcw size={24} />
            </button>

            <button
              onClick={togglePlay}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--cassette-red)] text-white shadow-lg transition hover:scale-105 active:scale-95"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause size={32} fill="currentColor" />
              ) : (
                <Play size={32} fill="currentColor" className="ml-1" />
              )}
            </button>
          </div>

          {/* Volume Slider Section */}
          <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-full border border-gray-800 min-w-[180px]">
            {volume === 0 ? (
              <VolumeX size={20} className="text-gray-600" />
            ) : (
              <Volume2 size={20} className="text-gray-400" />
            )}
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="h-1 w-24 cursor-pointer appearance-none rounded-lg bg-gray-700 accent-[var(--cassette-red)]"
            />
            <span className="text-[10px] font-mono text-gray-500 w-8">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}