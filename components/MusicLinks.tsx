"use client";

import Image from "next/image";

const links = [
  {
    name: "SoundCloud",
    href: "https://soundcloud.com/bryan-miller-27",
    icon: "/icons/soundcloud.svg",
    color: "bg-orange-500",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/channel/UCQDPCw7xwl3sQWjUjtnL1AQ",
    icon: "/icons/youtube.svg",
    color: "bg-red-600",
  },
  {
    name: "Apple Music",
    href: "https://music.apple.com/us/artist/aibry/1830943798",
    icon: "/icons/apple.svg",
    color: "bg-gray-800",
  },
  {
    name: "Spotify",
    href: "https://open.spotify.com/artist/6gw6SIOYGPhuMqOfLwJE9h",
    icon: "/icons/spotify.svg",
    color: "bg-green-600",
  },
  {
    name: "Bandcamp",
    href: "https://aibry.bandcamp.com/",
    icon: "/icons/bandcamp.svg",
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
          <Image src={icon} alt={name} width={20} height={20} />
          <span>{name}</span>
        </a>
      ))}
    </div>
  );
}
