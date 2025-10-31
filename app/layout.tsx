import "./globals.css";
import type { Metadata } from "next";

// Optional: site-wide metadata for SEO
export const metadata: Metadata = {
  title: "AIBRY",
  description: "AI-powered creativity platform",
};

// ✅ This layout runs entirely on the server — no hooks, no state, no Supabase calls.
// ✅ Keeps client logic in pages/components where 'use client' is declared.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-gray-100 min-h-screen antialiased">
        {/* global container */}
        <main className="relative flex flex-col items-center justify-start w-full min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
