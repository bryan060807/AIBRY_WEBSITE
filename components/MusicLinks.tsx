"use client";

import {
  Youtube,
  Music2,
  Soundcloud,
  Spotify,
  Apple,
  Music,
} from "lucide-react";

const links = [
  {
    name: "SoundCloud",
    href: "https://soundcloud.com/your-profile",
    icon: <Soundcloud className="w-5 h-5" />,
    color: "bg-orange-500",
  },
  {
    name: "YouTube",
    href: "https://youtube.com/your-channel",
    icon: <Youtube className="w-5 h-5" />,
    color: "bg-red-600",
  },
  {
    name: "Apple Music",
    href: "https://music.apple.com/your-profile",
    icon: <Apple className="w-5 h-5" />,
    color: "bg-gray-800",
  },
  {
    name: "Spotify",
    href: "https://spotify.com/your-artist-page",
    icon: <Spotify className="w-5 h-5" />,
    color: "bg-green-600",
  },
  {
    name: "Bandcamp",
    href: "https://yourartist.bandcamp.com",
    icon: <Music className="w-5 h-5" />,
    color: "bg-sky-500",
  },
];

export default function MusicLinks() {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-8">
      {links.map(({ name, href, icon, color }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-white shadow-sm ${color} hover:brightness-110 transition`}
        >
          {icon}
          <span>{name}</span>
        </a>
      ))}
    </div>
  );
}
