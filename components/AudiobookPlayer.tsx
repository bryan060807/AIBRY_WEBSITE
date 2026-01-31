"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";

export default function AudiobookPlayer({ src }: { src: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 1. Initial Setup: Handle Play/Pause Event Listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setPlay = () => setIsPlaying(true);
    const setPause = () => setIsPlaying(false);

    audio.addEventListener('play', setPlay);
    audio.addEventListener('pause', setPause);

    return () => {
      audio.removeEventListener('play', setPlay);
      audio.removeEventListener('pause', setPause);
    };
  }, []);

  // 2. Volume Logic: Updates volume WITHOUT reloading the file
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume; // Directly sets the property
    }
  }, [volume]); // Only runs when volume slider moves

  // 3. Chapter Logic: Only reloads when the 'src' actually changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.load(); // Reloads the new chapter
      audio.volume = volume; 
      if (isPlaying) {
        audio.play().catch(e => console.error("Playback failed", e));
      }
    }
  }, [src]); // removed 'isPlaying' and 'volume' from here to prevent restarts

  const togglePlay = () => {
    if (!audioRef.current) return;
    audioRef.current.paused ? audioRef.current.play() : audioRef.current.pause();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <div className="w-full rounded-xl border border-gray-800 bg-gray-900 p-8 shadow-2xl">
      <audio ref={audioRef} src={src} preload="auto" />
      
      <div className="flex flex-col items-center gap-8">
        <div className="h-1.5 w-full rounded-full bg-gray-800 overflow-hidden">
          <div className={`h-full bg-[var(--cassette-red)] transition-all duration-300 ${isPlaying ? 'w-1/2 opacity-100' : 'w-0 opacity-50'}`} />
        </div>

        <div className="flex w-full flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-8 flex-1 justify-center">
            <button 
              onClick={() => { if(audioRef.current) audioRef.current.currentTime -= 15 }} 
              className="text-gray-500 hover:text-white"
            >
              <RotateCcw size={24} />
            </button>

            <button
              onClick={togglePlay}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--cassette-red)] text-white shadow-lg transition hover:scale-105"
            >
              {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>
          </div>

          <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-full border border-gray-800 min-w-[180px]">
            {volume === 0 ? <VolumeX size={20} className="text-gray-600" /> : <Volume2 size={20} className="text-gray-400" />}
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="h-1 w-24 cursor-pointer appearance-none rounded-lg bg-gray-700 accent-[var(--cassette-red)]"
            />
            <span className="text-[10px] font-mono text-gray-500 w-8">{Math.round(volume * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}