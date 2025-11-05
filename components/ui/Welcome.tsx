import React from 'react';

export default function Welcome() {
  return (
    <div className="flex flex-col items-center justify-center text-center text-gray-500 p-4">
      <svg
        className="w-16 h-16 mb-4 text-gray-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
        />
      </svg>
      <h3 className="text-lg font-semibold text-gray-400">Your song awaits</h3>
      <p className="mt-1 max-w-xs">
        Fill in your lyrics and style notes, then click &quot;Generate Song&quot; to bring your creation to life.
      </p>
    </div>
  );
}