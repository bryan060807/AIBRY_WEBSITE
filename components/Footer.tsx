import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-800 bg-cassette-black text-gray-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 md:flex-row">
        {/* Left: Logo & Copyright */}
        <div className="flex flex-col items-center md:items-start">
          <Image
            src="/images/logo.png"
            alt="AIBRY Logo"
            width={120}
            height={40}
            className="mb-2"
          />
          <p className="text-sm">
            &copy; {new Date().getFullYear()} AIBRY. All rights reserved.
          </p>
        </div>

        {/* Center: Nav Links */}
        <nav className="flex gap-6 text-sm">
          <Link href="/discography" className="hover:text-cassette-red">
            Discography
          </Link>
          <Link href="/store" className="hover:text-cassette-red">
            Store
          </Link>
          <Link href="/about" className="hover:text-cassette-red">
            About
          </Link>
        </nav>

        {/* Right: Social / Platforms */}
        <div className="flex gap-4">
          <a
            href="https://soundcloud.com/bryan-miller-27"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/icons/soundcloud.svg"
              alt="SoundCloud"
              width={24}
              height={24}
            />
          </a>
          <a
            href="https://www.youtube.com/channel/UCQDPCw7xwl3sQWjUjtnL1AQ"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/icons/youtube.svg"
              alt="YouTube"
              width={24}
              height={24}
            />
          </a>
          <a
            href="https://music.apple.com/us/artist/aibry/1830943798"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/icons/apple.svg"
              alt="Apple Music"
              width={24}
              height={24}
            />
          </a>
          <a
            href="https://open.spotify.com/artist/6gw6SIOYGPhuMqOfLwJE9h"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/icons/spotify.svg"
              alt="Spotify"
              width={24}
              height={24}
            />
          </a>
          <a
            href="https://aibry.bandcamp.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/icons/bandcamp.svg"
              alt="Bandcamp"
              width={24}
              height={24}
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
