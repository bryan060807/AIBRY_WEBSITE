import Image from "next/image";

const links = [
  {
    name: "SoundCloud",
    href: "https://soundcloud.com/bryan-miller-27",
    icon: "/icons/soundcloud.svg",
    bg: "bg-orange-500 hover:bg-orange-600",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/channel/UCQDPCw7xwl3sQWjUjtnL1AQ",
    icon: "/icons/youtube.svg",
    bg: "bg-red-600 hover:bg-red-700",
  },
  {
    name: "Apple Music",
    href: "https://music.apple.com/us/artist/aibry/1830943798",
    icon: "/icons/apple.svg",
    bg: "bg-gray-700 hover:bg-gray-600",
  },
  {
    name: "Spotify",
    href: "https://open.spotify.com/artist/6gw6SIOYGPhuMqOfLwJE9h",
    icon: "/icons/spotify.svg",
    bg: "bg-green-600 hover:bg-green-700",
  },
  {
    name: "Bandcamp",
    href: "https://aibry.bandcamp.com/",
    icon: "/icons/bandcamp.svg",
    bg: "bg-sky-500 hover:bg-sky-600",
  },
];

export default function MusicLinks() {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-8">
      {links.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium ${link.bg} transition`}
        >
          <Image src={link.icon} alt={link.name} width={20} height={20} />
          <span>{link.name}</span>
        </a>
      ))}
    </div>
  );
}
