import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black/70 text-gray-400">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm space-y-4">
        <p>&copy; {new Date().getFullYear()} AIBRY. All rights reserved.</p>

        <p>
          Need to reach out?{' '}
          <Link
            href="/contact"
            className="text-[#629aa9] hover:text-[#83c0cc] transition-colors underline-offset-2 hover:underline"
          >
            Contact AIBRY
          </Link>
        </p>

        <div className="flex justify-center gap-5 text-gray-500">
          <a
            href="https://open.spotify.com/artist/..."
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#629aa9] transition-colors"
          >
            Spotify
          </a>
          <a
            href="https://music.apple.com/artist/..."
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#629aa9] transition-colors"
          >
            Apple Music
          </a>
          <a
            href="https://www.instagram.com/aibrymusic/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#629aa9] transition-colors"
          >
            Instagram
          </a>
          <a
            href="https://www.youtube.com/@aibrymusic"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#629aa9] transition-colors"
          >
            YouTube
          </a>
        </div>
      </div>
    </footer>
  );
}
