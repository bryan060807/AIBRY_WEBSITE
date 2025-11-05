'use client';

import { Toaster } from 'react-hot-toast';

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: '#1f2937', // slightly softer dark tone
          color: '#fff',
          borderRadius: '8px',
        },
        success: {
          duration: 6000,
        },
        error: {
          duration: 5000,
        },
      }}
    />
  );
}