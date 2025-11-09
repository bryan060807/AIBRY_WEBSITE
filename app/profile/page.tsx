'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error loading profile:', error.message);
        return;
      }

      setProfile(data);
    }

    loadProfile();
  }, [router]);

  if (!profile) {
    return (
      <main className="min-h-screen bg-black text-gray-400 flex items-center justify-center">
        <p>Loading profile...</p>
      </main>
    );
  }

  const avatarUrl = profile.avatar_url
    ? supabase.storage.from('avatars').getPublicUrl(profile.avatar_url).data.publicUrl
    : '/images/default-avatar.png';

  return (
    <main className="min-h-screen bg-black text-gray-100 py-24 px-6 flex flex-col items-center">
      <div className="max-w-xl text-center">
        <Image
          src={avatarUrl}
          alt={`${profile.display_name || 'User'} avatar`}
          width={160}
          height={160}
          className="rounded-full border border-[#83c0cc] mx-auto mb-6 object-cover"
        />
        <h1 className="text-4xl font-bold text-[#83c0cc] mb-2">
          {profile.display_name || 'Unnamed'}
        </h1>
        <p className="text-gray-400 mb-4">{profile.bio || 'No bio yet.'}</p>

        <div className="flex flex-wrap justify-center gap-5 text-[#83c0cc] mb-6">
          {profile.instagram && (
            <Link href={profile.instagram} target="_blank">
              Instagram
            </Link>
          )}
          {profile.tiktok && (
            <Link href={profile.tiktok} target="_blank">
              TikTok
            </Link>
          )}
          {profile.spotify && (
            <Link href={profile.spotify} target="_blank">
              Spotify
            </Link>
          )}
          {profile.soundcloud && (
            <Link href={profile.soundcloud} target="_blank">
              SoundCloud
            </Link>
          )}
          {profile.facebook && (
            <Link href={profile.facebook} target="_blank">
              Facebook
            </Link>
          )}
        </div>

        <Link
          href="/profile/edit"
          className="inline-block bg-[#83c0cc] hover:bg-[#6eb5c0] text-black font-semibold px-6 py-2 rounded-lg transition"
        >
          Edit Profile
        </Link>
      </div>
    </main>
  );
}
