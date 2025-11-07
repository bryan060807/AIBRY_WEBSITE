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

        <div className="flex justify-center flex-wrap gap-5 text-gray-500">
          <a
            href="https://open.spotify.com/artist/6gw6SIOYGPhuMqOfLwJE9h"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="AIBRY on Spotify"
            className="hover:text-[#629aa9] transition-colors"
          >
            Spotify
          </a>

          <a
            href="https://music.apple.com/us/artist/aibry/1830943798"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="AIBRY on Apple Music"
            className="hover:text-[#629aa9] transition-colors"
          >
            Apple Music
          </a>

          <a
            href="https://www.instagram.com/aibrymusic/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="AIBRY on Instagram"
            className="hover:text-[#629aa9] transition-colors"
          >
            Instagram
          </a>

          <a
            href="https://www.youtube.com/channel/UCQDPCw7xwl3sQWjUjtnL1AQ"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="AIBRY on YouTube"
            className="hover:text-[#629aa9] transition-colors"
          >
            YouTube
          </a>

          <a
            href="https://www.facebook.com/profile.php?id=61579129561083"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="AIBRY on Facebook"
            className="hover:text-[#629aa9] transition-colors"
          >
            Facebook
          </a>

          <a
            href="https://www.pandora.com/artist/aibry/ARPK2q9ZXvczxvX"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="AIBRY on Pandora"
            className="hover:text-[#629aa9] transition-colors"
          >
            Pandora
          </a>
        </div>
      </div>
    </footer>
  );
}
