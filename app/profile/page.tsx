'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Instagram, Twitter, Music2, Video } from 'lucide-react';

interface Profile {
  id: string;
  display_name: string;
  email?: string;
  bio?: string;
  avatar_url?: string;
  created_at?: string;
  instagram?: string;
  twitter?: string;
  spotify?: string;
  tiktok?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select(
          'id, display_name, email, bio, avatar_url, created_at, instagram, twitter, spotify, tiktok'
        )
        .eq('id', session.user.id)
        .single();

      if (error) console.error('Error loading profile:', error.message);
      if (data) setProfile(data);
      setLoading(false);
    }

    loadProfile();
  }, [router]);

  if (loading) {
    return (
      <main className="flex items-center justify-center h-screen text-gray-400">
        <div className="animate-pulse">Loading profile...</div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="flex items-center justify-center h-screen text-gray-400">
        You must be logged in to view your profile.
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-gray-200">
      <section className="text-center">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={`${profile.display_name}'s profile picture`}
            className="mx-auto w-32 h-32 rounded-full mb-4 border-2 border-gray-700 object-cover"
          />
        ) : (
          <div
            aria-label="Default avatar"
            className="mx-auto w-32 h-32 rounded-full bg-gray-800 border-2 border-gray-700 mb-4 flex items-center justify-center text-gray-500 text-3xl"
          >
            {profile.display_name ? profile.display_name[0].toUpperCase() : '?'}
          </div>
        )}

        <h1 className="text-3xl font-bold text-white mb-2">
          {profile.display_name || 'Anonymous User'}
        </h1>
        <p className="text-gray-400">{profile.email}</p>
        {profile.bio && <p className="text-gray-500 mt-2 italic">{profile.bio}</p>}
        {profile.created_at && (
          <p className="text-gray-600 text-sm mt-2">
            Joined{' '}
            <time dateTime={profile.created_at}>
              {new Date(profile.created_at).toLocaleDateString()}
            </time>
          </p>
        )}

        {/* Social Links */}
        {(profile.instagram ||
          profile.twitter ||
          profile.spotify ||
          profile.tiktok) && (
          <div className="flex justify-center gap-5 mt-6 text-gray-400">
            {profile.instagram && (
              <Link
                href={
                  profile.instagram.startsWith('http')
                    ? profile.instagram
                    : `https://${profile.instagram}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#629aa9] transition"
              >
                <Instagram size={22} />
              </Link>
            )}
            {profile.twitter && (
              <Link
                href={
                  profile.twitter.startsWith('http')
                    ? profile.twitter
                    : `https://${profile.twitter}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#629aa9] transition"
              >
                <Twitter size={22} />
              </Link>
            )}
            {profile.spotify && (
              <Link
                href={
                  profile.spotify.startsWith('http')
                    ? profile.spotify
                    : `https://${profile.spotify}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#629aa9] transition"
              >
                <Music2 size={22} />
              </Link>
            )}
            {profile.tiktok && (
              <Link
                href={
                  profile.tiktok.startsWith('http')
                    ? profile.tiktok
                    : `https://${profile.tiktok}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#629aa9] transition"
              >
                <Video size={22} />
              </Link>
            )}
          </div>
        )}
      </section>

      <div className="text-center mt-10">
        <Link
          href="/profile/edit"
          className="bg-[#629aa9] hover:bg-[#4f7f86] text-white px-6 py-3 rounded-md font-semibold transition"
        >
          Edit Profile
        </Link>
      </div>
    </main>
  );
}
