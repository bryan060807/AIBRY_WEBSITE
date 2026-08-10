import Link from 'next/link';
import { siteMetadata } from '@/lib/metadata';

export default function Footer() {
  const { soundcloud, youtube } = siteMetadata.social;

  return (
    <footer className="border-t border-gray-800 bg-black text-gray-400 py-10 text-center">
      <nav className="flex justify-center flex-wrap gap-6 text-[#83c0cc] font-medium mb-6">
        <Link href="/" className="hover:text-[#6eb5c0] transition-colors">Home</Link>
        <Link href="/apps" className="hover:text-[#6eb5c0] transition-colors">Apps & Systems</Link>
        <Link href="/store" className="hover:text-[#6eb5c0] transition-colors">Store</Link>
        <Link href="/discography" className="hover:text-[#6eb5c0] transition-colors">Music</Link>
        <Link href="/about" className="hover:text-[#6eb5c0] transition-colors">About</Link>
      </nav>

      <div className="mb-6 flex flex-wrap justify-center gap-5 text-sm">
        <a
          href={soundcloud}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#629aa9] transition-colors hover:text-[#83c0cc] hover:underline underline-offset-2"
        >
          SoundCloud
        </a>
        <a
          href={youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#629aa9] transition-colors hover:text-[#83c0cc] hover:underline underline-offset-2"
        >
          YouTube
        </a>
      </div>

      <p>
        Questions, ideas, or project notes?{' '}
        <Link
          href="/contact"
          className="text-[#629aa9] hover:text-[#83c0cc] transition-colors underline-offset-2 hover:underline"
        >
          Contact AIBRY
        </Link>
      </p>

      <p className="text-gray-600 text-sm mt-4">
        © {new Date().getFullYear()} AIBRY Labs — Applied AI, software systems, and real-world tools.
      </p>
    </footer>
  );
}
