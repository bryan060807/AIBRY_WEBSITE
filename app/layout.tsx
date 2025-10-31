import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIBRY",
  description: "AI-powered creativity platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-gray-100 min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full py-4 border-b border-gray-800 bg-gray-950 text-center">
          <h1 className="text-2xl font-bold text-indigo-400">AIBRY</h1>
        </header>

        {/* Main content */}
        <main className="flex-grow w-full flex justify-center items-start px-4 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="w-full py-4 border-t border-gray-800 bg-gray-950 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} AIBRY. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
