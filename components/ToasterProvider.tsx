// components/ToasterProvider.tsx
"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        // Define default options
        style: {
          background: "#333", // A dark background
          color: "#fff",      // White text
        },
        // Default options for specific types
        success: {
          duration: 6000, // Make success messages last a bit longer
        },
        error: {
          duration: 5000,
        },
      }}
    />
  );
}