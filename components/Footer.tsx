// components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 w-full border-t border-gray-800 bg-black">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          
          {/* Footer Navigation */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-400">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <Link href="/about" className="transition hover:text-white">
              About
            </Link>
            <Link href="/discography" className="transition hover:text-white">
              Discography
            </Link>
            <Link href="/gallery" className="transition hover:text-white">
              Gallery
            </Link>
            <Link href="/merch" className="transition hover:text-white">
              Merch
            </Link>
            <Link href="/archive" className="transition hover:text-white">
              Archive
            </Link>
            <Link href="/forum" className="transition hover:text-white">
              Forum
            </Link>
            <Link href="/todo" className="transition hover:text-white">
              ToDO List
            </Link>
            <Link href="/monday" className="transition hover:text-white">
              Monday2.0
            </Link>
          </div>
          
          {/* Copyright */}
          <p className="text-sm text-gray-500">
            &copy; {currentYear} AIBRY. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}