'use client';

import React from 'react';

interface LoaderProps {
  message?: string;
}

export default function Loader({ message = 'Weaving your masterpiece...' }: LoaderProps) {
  return (
    <div
      className="flex flex-col items-center justify-center space-y-4 text-center p-6"
      role="status"
      aria-busy="true"
    >
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#629aa9]" />
      <p className="text-[#629aa9] font-medium">{message}</p>
      <p className="text-sm text-gray-400">This may take up to a minute.</p>
    </div>
  );
}
