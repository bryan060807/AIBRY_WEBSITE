"use client";

import Link from "next/link";
import { useState } from "react";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FaEnvelope } from "react-icons/fa";
import NewsletterModal from "@/components/NewsletterModal";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isNewsletterOpen, setNewsletterOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-black bg-[#0f0f0f] py-4 text-white shadow">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold">
          AIBRY
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden space-x-6 md:flex">
          <Link href="/" className="hover:text-[#629aa9]">Home</Link>
          <Link href="/discography" className="hover:text-[#629aa9]">Discography</Link>
          <Link href="/store" className="hover:text-[#629aa9]">Store</Link>
          <Link href="/merch" className="hover:text-[#629aa9]">Merch</Link>
          <Link href="/about" className="hover:text-[#629aa9]">About</Link>
          <Link href="/gallery" className="hover:text-[#629aa9]">Gallery</Link>
          <button
            onClick={() => setNewsletterOpen(true)}
            className="flex items-center gap-1 hover:text-[#629aa9]"
          >
            <FaEnvelope />
            Newsletter
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <nav className="mt-4 space-y-2 px-4 pb-4 text-sm md:hidden">
          <Link href="/" className="block hover:text-[#629aa9]">Home</Link>
          <Link href="/discography" className="block hover:text-[#629aa9]">Discography</Link>
          <Link href="/store" className="block hover:text-[#629aa9]">Store</Link>
          <Link href="/merch" className="block hover:text-[#629aa9]">Merch</Link>
          <Link href="/about" className="block hover:text-[#629aa9]">About</Link>
          <Link href="/gallery" className="block hover:text-[#629aa9]">Gallery</Link>
          <button
            onClick={() => setNewsletterOpen(true)}
            className="flex items-center gap-1 hover:text-[#629aa9]"
          >
            <FaEnvelope />
            Newsletter
          </button>
        </nav>
      )}

      {/* Modal */}
      <NewsletterModal isOpen={isNewsletterOpen} onClose={() => setNewsletterOpen(false)} />
    </header>
  );
}
