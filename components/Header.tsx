"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        {/* Logo / Home */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png" // put your logo here in /public/images/logo.png
            alt="AIBRY Logo"
            width={140}
            height={40}
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden space-x-6 md:flex">
          <Link href="/" className="hover:text-[#629aa9]">
            Home
          </Link>
          <Link href="/discography" className="hover:text-[#629aa9]">
            Discography
          </Link>
          <Link href="/store" className="hover:text-[#629aa9]">
            Store
          </Link>
          <Link href="/merch" className="hover:text-[#629aa9]">
            Merch
          </Link>
          <Link href="/about" className="hover:text-[#629aa9]">
            About
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isOpen
                  ? "M6 18L18 6M6 6l12 12" // X icon
                  : "M4 6h16M4 12h16M4 18h16" // Burger icon
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <nav className="flex flex-col space-y-4 border-t border-gray-800 bg-black px-4 py-6 md:hidden">
          <Link href="/" className="hover:text-[#629aa9]">
            Home
          </Link>
          <Link href="/discography" className="hover:text-[#629aa9]">
            Discography
          </Link>
          <Link href="/store" className="hover:text-[#629aa9]">
            Store
          </Link>
          <Link href="/merch" className="hover:text-[#629aa9]">
            Merch
          </Link>
          <Link href="/about" className="hover:text-[#629aa9]">
            About
          </Link>
        </nav>
      )}
    </header>
  );
}
