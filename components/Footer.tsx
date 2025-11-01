'use client';

import { useEffect, useRef, useState } from 'react';

export default function Footer() {
  const [visible, setVisible] = useState(false);
  const footerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      className={`mt-16 border-t border-gray-800 bg-black/90 text-gray-400 transform transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <div className="mx-auto max-w-5xl px-4 py-10 text-center">
        <div className="mb-4 flex justify-center gap-6 flex-wrap">
          <a
            href="https://open.spotify.com/artist/6gw6SIOYGPhuMqOfLwJE9h"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
          >
            Spotify
          </a>
          <a
            href="https://soundcloud.com/bryan-miller-27"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
          >
            SoundCloud
          </a>
          <a
            href="https://aibry.bandcamp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
          >
            Bandcamp
          </a>
          <a
            href="https://www.youtube.com/channel/UCQDPCw7xwl3sQWjUjtnL1AQ"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
          >
            YouTube
          </a>
          <a
            href="mailto:aibry@aibry.shop"
            className="hover:text-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
          >
            aibry@aibry.shop
          </a>
        </div>
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} AIBRY. All rights reserved.
        </p>
      </div>
    </footer>
  );
}