// components/SongDisplay.tsx
"use client";

import React from 'react';
import type { GeneratedSong } from '../types';

interface SongDisplayProps {
  song: GeneratedSong;
}

export const SongDisplay: React.FC<SongDisplayProps> = ({ song }) => {
  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center text-center space-y-4 animate-fade-in">
      <div>
        <h3 className="text-xl font-bold text-white">{song.title}</h3>
        <p className="text-sm text-gray-400 mt-1">{song.description}</p>
      </div>
      
      {song.audioUrl ? (
        <audio controls src={song.audioUrl} className="w-full mt-4" key={song.audioUrl}>
          Your browser does not support the audio element.
        </audio>
      ) : (
        <div className="w-full bg-gray-900/50 rounded-md p-3 text-center text-xs text-gray-400 border border-gray-700">
            <p>Audio is generating...</p>
        </div>
      )}

      {/* Download button functionality can be re-added here later if desired */}
      <div className="text-xs text-gray-500 pt-2">
        <p><strong>Note:</strong> Song details and audio are AI-generated based on your prompts.</p>
      </div>
    </div>
  );
};