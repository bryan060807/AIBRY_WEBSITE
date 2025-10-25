// components/Footer.tsx

"use client";

import Link from "next/link";
import { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import NewsletterModal from "@/components/NewsletterModal";

export default function Footer() {
  const [isNewsletterOpen, setNewsletterOpen] = useState(false);

  return (
    <footer className="border-t border-black bg-[#0f0f0f] px-4 py-10 text-sm text-gray-400">
      <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-6 sm:flex-row">
        <p className="text-center sm:text-left">&copy; {new Date().getFullYear()} AIBRY. All rights reserved.</p>

        <nav className="flex flex-wrap justify-center gap-6 text-sm">
          <Link href="/discography" className="hover:text-cassette-red">Discography</Link>
          <Link href="/store" className="hover:text-cassette-red">Store</Link>
          <Link href="/about" className="hover:text-cassette-red">About</Link>
          <Link href="/gallery" className="hover:text-cassette-red">Gallery</Link>
          <Link href="/merch" className="hover:text-cassette-red">Merch</Link>
          
          {/* NEW MONDAY 2.0 LINK */}
          <Link href="/monday-gpt" className="hover:text-cassette-red">Monday 2.0</Link>

          <button
            onClick={() => setNewsletterOpen(true)}
            className="flex items-center gap-1 hover:text-cassette-red"
          >
            <FaEnvelope />
            Newsletter
          </button>
        </nav>
      </div>

      {/* Modal */}
      <NewsletterModal isOpen={isNewsletterOpen} onClose={() => setNewsletterOpen(false)} />
    </footer>
  );
}