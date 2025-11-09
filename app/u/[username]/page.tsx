import { supabase } from '@/utils/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

// Generate metadata dynamically for SEO
export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const { data } = await supabase
    .from('profiles')
    .select('display_name, bio, avatar_url')
    .eq('username', params.username)
    .single();

  if (!data) {
    return {
      title: 'User Not Found | AIBRY',
      description: 'The requested profile could not be found.',
    };
  }

  const avatarUrl = data.avatar_url
    ? supabase.storage.from('avatars').getPublicUrl(data.avatar_url).data.publicUrl
    : '/images/default-avatar.png';

  return {
    title: `${data.display_name || params.username} | AIBRY`,
    description: data.bio || 'View artist profile and links.',
    openGraph: {
      title: `${data.display_name || params.username} | AIBRY`,
      description: data.bio || '',
      images: [{ url: avatarUrl }],
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title: data.display_name || params.username,
      description: data.bio || '',
      images: [avatarUrl],
    },
  };
}

export default async function PublicProfile({ params }: { params: { username: string } }) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .single();

  if (!data || error) {
    return (
      <main className="min-h-screen bg-black text-gray-400 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#83c0cc] mb-3">Profile Not Found</h1>
          <p className="text-gray-500 mb-6">This user doesn’t exist or their profile is private.</p>
          <Link href="/" className="text-[#83c0cc] underline hover:text-[#6eb5c0]">
            Go Home
          </Link>
        </div>
      </main>
    );
  }

  const avatarUrl = data.avatar_url
    ? supabase.storage.from('avatars').getPublicUrl(data.avatar_url).data.publicUrl
    : '/images/default-avatar.png';

  return (
    <main className="min-h-screen bg-black text-gray-100 py-24 px-6 flex flex-col items-center">
      <div className="max-w-xl text-center">
        <Image
          src={avatarUrl}
          alt={`${data.display_name || data.username} avatar`}
          width={160}
          height={160}
          className="rounded-full border border-[#83c0cc] mx-auto mb-6 object-cover"
        />

        <h1 className="text-4xl font-bold text-[#83c0cc] mb-2">
          {data.display_name || data.username}
        </h1>
        {data.bio && <p className="text-gray-400 mb-6">{data.bio}</p>}

        <div className="flex flex-wrap justify-center gap-5 text-[#83c0cc] mb-6">
          {data.instagram && (
            <Link href={data.instagram} target="_blank">
              Instagram
            </Link>
          )}
          {data.tiktok && (
            <Link href={data.tiktok} target="_blank">
              TikTok
            </Link>
          )}
          {data.spotify && (
            <Link href={data.spotify} target="_blank">
              Spotify
            </Link>
          )}
          {data.soundcloud && (
            <Link href={data.soundcloud} target="_blank">
              SoundCloud
            </Link>
          )}
          {data.facebook && (
            <Link href={data.facebook} target="_blank">
              Facebook
            </Link>
          )}
        </div>

        <p className="text-xs text-gray-600 mt-8">
          © {new Date().getFullYear()} {data.display_name || data.username} — Hosted on AIBRY
        </p>
      </div>
    </main>
  );
}
