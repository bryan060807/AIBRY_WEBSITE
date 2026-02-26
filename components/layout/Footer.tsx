import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black text-gray-400 py-10 text-center">
      <nav className="flex justify-center flex-wrap gap-6 text-[#83c0cc] font-medium mb-6">
        <Link href="/" className="hover:text-[#6eb5c0] transition-colors">Home</Link>
        <Link href="/discography" className="hover:text-[#6eb5c0] transition-colors">Discography</Link>
        <Link href="/about" className="hover:text-[#6eb5c0] transition-colors">About</Link>
      </nav>

      <p>
        Need to reach out?{' '}
        <Link
          href="/contact"
          className="text-[#629aa9] hover:text-[#83c0cc] transition-colors underline-offset-2 hover:underline"
        >
          Contact AIBRY
        </Link>
      </p>

      <p className="text-gray-600 text-sm mt-4">
        © {new Date().getFullYear()} AIBRY — All Rights Reserved.
      </p>
    </footer>
  );
}
