import Image from "next/image";

export const metadata = {
  title: "AIBRY Discography",
  description: "Explore AIBRY's albums and singles.",
};

// Reusable Spotify placeholder URL for consistency
const SPOTIFY_PLACEHOLDER = "https://open.spotify.com/artist/YOUR_ARTIST_ID";
const APPLE_MUSIC_URL = "https://music.apple.com/us/artist/aibry/1830943798";
const YOUTUBE_URL = "https://www.youtube.com/channel/UCQDPCw7xwl3sQWjUjtnL1AQ";
const SOUNDCLOUD_URL = "https://soundcloud.com/bryan-miller-27";


type Release = {
  title: string;
  year: number;
  cover: string;
  links: {
    bandcamp: string;
    spotify: string;
    apple: string;
    youtube: string;
    soundcloud: string;
  };
};

const releases: Release[] = [
  // --- NEW RELEASES ---
  {
    title: "Fault Line Bloom",
    year: 2025,
    cover: "/images/discography/fault-line-bloom.jpg",
    links: {
      bandcamp: "https://aibry.bandcamp.com/album/fault-line-bloom",
      spotify: SPOTIFY_PLACEHOLDER,
      apple: APPLE_MUSIC_URL,
      youtube: YOUTUBE_URL,
      soundcloud: SOUNDCLOUD_URL,
    },
  },
  {
    title: "Epitaphs From the Neon Dust",
    year: 2025,
    cover: "/images/discography/epitaphs-from-the-neon-dust.jpg",
    links: {
      bandcamp: "https://aibry.bandcamp.com/album/epitaphs-from-the-neon-dust",
      spotify: SPOTIFY_PLACEHOLDER,
      apple: APPLE_MUSIC_URL,
      youtube: YOUTUBE_URL,
      soundcloud: SOUNDCLOUD_URL,
    },
  },
  {
    title: "Fractured Circuits",
    year: 2025,
    cover: "/images/discography/fractured-circuits.jpg",
    links: {
      bandcamp: "https://aibry.bandcamp.com/track/fractured-circuits",
      spotify: SPOTIFY_PLACEHOLDER,
      apple: APPLE_MUSIC_URL,
      youtube: YOUTUBE_URL,
      soundcloud: SOUNDCLOUD_URL,
    },
  },
  {
    title: "Glass Eyes",
    year: 2025,
    cover: "/images/discography/glass-eyes.jpg",
    links: {
      bandcamp: "https://aibry.bandcamp.com/track/glass-eyes",
      spotify: SPOTIFY_PLACEHOLDER,
      apple: APPLE_MUSIC_URL,
      youtube: YOUTUBE_URL,
      soundcloud: SOUNDCLOUD_URL,
    },
  },
  {
    title: "Ghost in the Glass",
    year: 2025,
    cover: "/images/discography/ghost-in-the-glass.jpg",
    links: {
      bandcamp: "https://aibry.bandcamp.com/track/ghost-in-the-glass",
      spotify: SPOTIFY_PLACEHOLDER,
      apple: APPLE_MUSIC_URL,
      youtube: YOUTUBE_URL,
      soundcloud: SOUNDCLOUD_URL,
    },
  },
  {
    title: "The Scar That Sings",
    year: 2025,
    cover: "/images/discography/the-scar-that-sings.jpg",
    links: {
      bandcamp: "https://aibry.bandcamp.com/track/the-scar-that-sings",
      spotify: SPOTIFY_PLACEHOLDER,
      apple: APPLE_MUSIC_URL,
      youtube: YOUTUBE_URL,
      soundcloud: SOUNDCLOUD_URL,
    },
  },
  {
    title: "Bullet in the Halo",
    year: 2025,
    cover: "/images/discography/bullet-in-the-halo.jpg",
    links: {
      bandcamp: "https://aibry.bandcamp.com/track/bullet-in-the-halo",
      spotify: SPOTIFY_PLACEHOLDER,
      apple: APPLE_MUSIC_URL,
      youtube: YOUTUBE_URL,
      soundcloud: SOUNDCLOUD_URL,
    },
  },
  // --- EXISTING RELEASES ---
  {
    title: "Boots On, Heart Open",
    year: 2025,
    cover: "/images/discography/boots-on-heart-open.jpg",
    links: {
      bandcamp: "https://aibry.bandcamp.com/album/boots-on-heart-open",
      spotify: SPOTIFY_PLACEHOLDER,
      apple: APPLE_MUSIC_URL,
      youtube: YOUTUBE_URL,
      soundcloud: SOUNDCLOUD_URL,
    },
  },
  {
    title: "Forty Years in the Fire",
    year: 2025,
    cover: "/images/discography/forty-years-in-the-fire.jpg",
    links: {
      bandcamp: "https://aibry.bandcamp.com/track/forty-years-in-the-fire",
      spotify: SPOTIFY_PLACEHOLDER,
      apple: APPLE_MUSIC_URL,
      youtube: YOUTUBE_URL,
      soundcloud: SOUNDCLOUD_URL,
    },
  },
  {
    title: "Whispers Beneath the Ash",
    year: 2025,
    cover: "/images/discography/whispers-beneath-the-ash.jpg",
    links: {
      bandcamp: "https://aibry.bandcamp.com/album/whispers-beneath-the-ash",
      spotify: SPOTIFY_PLACEHOLDER,
      apple: APPLE_MUSIC_URL,
      youtube: YOUTUBE_URL,
      soundcloud: SOUNDCLOUD_URL,
    },
  },
  {
    title: "Choir of Broken Mouths",
    year: 2025,
    cover: "/images/discography/choir-of-broken-mouths.jpg",
    links: {
      bandcamp: "https://aibry.bandcamp.com/album/choir-of-broken-mouths",
      spotify: SPOTIFY_PLACEHOLDER,
      apple: APPLE_MUSIC_URL,
      youtube: YOUTUBE_URL,
      soundcloud: SOUNDCLOUD_URL,
    },
  },
  {
    title: "The Cassette Tapes",
    year: 2025,
    cover: "/images/discography/the-cassette-tapes.jpg",
    links: {
      bandcamp: "https://aibry.bandcamp.com/album/the-cassette-tapes",
      spotify: SPOTIFY_PLACEHOLDER,
      apple: APPLE_MUSIC_URL,
      youtube: YOUTUBE_URL,
      soundcloud: SOUNDCLOUD_URL,
    },
  },
  {
    title: "I Stayed, I Wish You Had Too",
    year: 2025,
    cover: "/images/discography/i-stayed-i-wish-you-had-too.jpg",
    links: {
      bandcamp: "https://aibry.bandcamp.com/track/i-stayed-i-wish-you-had-too",
      spotify: SPOTIFY_PLACEHOLDER,
      apple: APPLE_MUSIC_URL,
      youtube: YOUTUBE_URL,
      soundcloud: SOUNDCLOUD_URL,
    },
  },
].sort((a, b) => b.title.localeCompare(a.title)); // Sort by title descending (to keep new releases near top), since all years are 2025

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