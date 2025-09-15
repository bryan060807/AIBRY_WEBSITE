import Image from "next/image";
import { Youtube, Music2, Headphones, Radio } from "lucide-react"; // icons for links

export const metadata = {
  title: "AIBRY Discography",
  description: "Explore AIBRY's albums and singles.",
};

const releases = [
  {
    title: "Boots On, Heart Open",
    year: 2024,
    cover: "/images/discography/boots-on-heart-open.jpg",
    links: {
      bandcamp: "https://aibry.bandcamp.com/album/boots-on-heart-open",
      spotify:
        "https://open.spotify.com/album/6gw6SIOYGPhuMqOfLwJE9h", // replace with real
      apple:
        "https://music.apple.com/us/album/boots-on-heart-open/1830943798", // replace with real
      youtube:
        "https://www.youtube.com/channel/UCQDPCw7xwl3sQWjUjtnL1AQ",
      soundcloud: "https://soundcloud.com/bryan-miller-27",
    },
  },
  {
    title: "Forty Years in the Fire",
    year: 2024,
    cover: "/images/discography/forty-years-in-the-fire.jpg",
    links: {
      bandcamp: "https://aibry.bandcamp.com/track/forty-years-in-the-fire",
      spotify:
        "https://open.spotify.com/track/40yearsid", // placeholder
      apple:
        "https://music.apple.com/us/album/forty-years-in-the-fire/1830943798", // placeholder
      youtube:
        "https://www.youtube.com/channel/UCQDPCw7xwl3sQWjUjtnL1AQ",
      soundcloud: "https://soundcloud.com/bryan-miller-27",
    },
  },
  {
    title: "Whispers Beneath the Ash",
    year: 2025,
    cover: "/images/discography/whispers-beneath-the-ash.jpg",
    links: {
      bandcamp:
        "https://aibry.bandcamp.com/album/whispers-beneath-the-ash",
      spotify:
        "https://open.spotify.com/album/whispersbeneathid", // placeholder
      apple:
        "https://music.apple.com/us/album/whispers-beneath-the-ash/1830943798", // placeholder
      youtube:
        "https://www.youtube.com/channel/UCQDPCw7xwl3sQWjUjtnL1AQ",
      soundcloud: "https://soundcloud.com/bryan-miller-27",
    },
  },
];

export default function DiscographyPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-10 text-center text-3xl font-bold">Discography</h1>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {releases.map((release) => (
          <div
            key={release.title}
            className="rounded-lg border border-gray-800 bg-gray-900 shadow-md transition hover:shadow-xl"
          >
            <div className="mb-4 aspect-square w-full overflow-hidden rounded-t-lg">
              <Image
                src={release.cover}
                alt={release.title}
                width={500}
                height={500}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="px-4 pb-4">
              <h2 className="text-lg font-semibold text-white">
                {release.title}
              </h2>
              <p className="mb-4 text-sm text-gray-400">{release.year}</p>
              <div className="flex flex-col gap-2">
                <a
                  href={release.links.bandcamp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full rounded bg-[#629aa9] px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-[#4f7f86]"
                >
                  Bandcamp
                </a>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={release.links.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded bg-green-600 px-3 py-2 text-center text-xs font-semibold text-white hover:bg-green-700"
                  >
                    Spotify
                  </a>
                  <a
                    href={release.links.apple}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded bg-gray-700 px-3 py-2 text-center text-xs font-semibold text-white hover:bg-gray-800"
                  >
                    Apple Music
                  </a>
                  <a
                    href={release.links.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded bg-red-600 px-3 py-2 text-center text-xs font-semibold text-white hover:bg-red-700"
                  >
                    YouTube
                  </a>
                  <a
                    href={release.links.soundcloud}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded bg-orange-500 px-3 py-2 text-center text-xs font-semibold text-white hover:bg-orange-600"
                  >
                    SoundCloud
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
