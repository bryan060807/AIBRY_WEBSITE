'use client';

import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void; // optional retry handler
}

export default function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center text-red-400 p-6"
      role="alert"
      aria-live="assertive"
    >
      <svg
        className="w-12 h-12 mb-3"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>

      <p className="font-semibold text-white">Oops! Something went wrong.</p>
      <p className="text-sm text-gray-400 mt-1">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-[#629aa9] hover:bg-gray-700 transition"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
