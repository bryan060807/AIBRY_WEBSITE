'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import {
  Instagram,
  Twitter,
  Music2,
  Video,
  Facebook,
  Music,
} from 'lucide-react';

interface Profile {
  id: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  instagram?: string;
  twitter?: string;
  spotify?: string;
  tiktok?: string;
  facebook?: string;
  soundcloud?: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
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
          'id, display_name, bio, avatar_url, instagram, twitter, spotify, tiktok, facebook, soundcloud'
        )
        .eq('id', session.user.id)
        .single();

      if (error) toast.error('Failed to load profile.');
      else {
        setProfile(data);
        setDisplayName(data.display_name || '');
        setBio(data.bio || '');
      }
    }

    fetchProfile();
  }, [router]);

  const normalizeSocialLink = (platform: string, value: string): string => {
    if (!value) return '';
    const trimmed = value.trim();
    if (trimmed.startsWith('http')) return trimmed;
    const username = trimmed.startsWith('@') ? trimmed.slice(1) : trimmed;
    switch (platform) {
      case 'instagram':
        return `https://instagram.com/${username}`;
      case 'twitter':
        return `https://twitter.com/${username}`;
      case 'tiktok':
        return `https://tiktok.com/@${username}`;
      case 'facebook':
        return `https://facebook.com/${username}`;
      case 'soundcloud':
        return `https://soundcloud.com/${username}`;
      case 'spotify':
        return trimmed.startsWith('open.spotify.com')
          ? `https://${trimmed}`
          : 'https://open.spotify.com/';
      default:
        return trimmed;
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file || !profile) return;
      setUploading(true);
      const ext = file.name.split('.').pop();
      const fileName = `${profile.id}-${Date.now()}.${ext}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const publicUrl = publicData.publicUrl;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);
      if (updateError) throw updateError;

      toast.success('Avatar updated!');
      setProfile({ ...profile, avatar_url: publicUrl });
    } catch {
      toast.error('Error uploading avatar.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);

    const updated = {
      ...profile,
      instagram: normalizeSocialLink('instagram', profile.instagram || ''),
      twitter: normalizeSocialLink('twitter', profile.twitter || ''),
      spotify: normalizeSocialLink('spotify', profile.spotify || ''),
      tiktok: normalizeSocialLink('tiktok', profile.tiktok || ''),
      facebook: normalizeSocialLink('facebook', profile.facebook || ''),
      soundcloud: normalizeSocialLink('soundcloud', profile.soundcloud || ''),
    };

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName,
        bio,
        instagram: updated.instagram,
        twitter: updated.twitter,
        spotify: updated.spotify,
        tiktok: updated.tiktok,
        facebook: updated.facebook,
        soundcloud: updated.soundcloud,
      })
      .eq('id', profile.id);

    if (error) toast.error('Error saving profile.');
    else {
      toast.success('Profile updated!');
      router.push('/profile');
    }
    setSaving(false);
  };

  if (!profile)
    return (
      <main className="flex min-h-screen items-center justify-center text-gray-400">
        <p>Loading profile...</p>
      </main>
    );

  const socials = [
    { key: 'instagram', icon: Instagram, color: '#E1306C' },
    { key: 'twitter', icon: Twitter, color: '#1DA1F2' },
    { key: 'spotify', icon: Music2, color: '#1DB954' },
    { key: 'tiktok', icon: Video, color: '#FE2C55' },
    { key: 'facebook', icon: Facebook, color: '#1877F2' },
    { key: 'soundcloud', icon: Music, color: '#FF5500' },
  ];

  const activeSocials = socials.filter(
    ({ key }) => profile[key as keyof Profile]
  );

  return (
    <main className="mx-auto max-w-lg px-4 py-12 text-white">
      <h1 className="mb-6 text-2xl font-bold">Edit Profile</h1>

      <div className="flex flex-col items-center space-y-4">
        {/* Avatar */}
        <div className="relative">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt="Avatar"
              width={120}
              height={120}
              className="rounded-full border border-gray-700 object-cover"
            />
          ) : (
            <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full border border-gray-700 bg-gray-800 text-gray-500">
              No Avatar
            </div>
          )}
          <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-[#629aa9] p-2 text-sm text-white hover:bg-[#4f7f86] transition">
            <input type="file" accept="image/*" onChange={handleAvatarUpload} hidden />
            {uploading ? '…' : '✎'}
          </label>
        </div>

        {/* Display Name */}
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Display Name"
          className="mt-4 w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-gray-200 placeholder-gray-500 focus:border-[#629aa9] focus:ring-2 focus:ring-[#629aa9]"
        />

        {/* Bio */}
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          placeholder="Write something about yourself..."
          className="mt-4 w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-gray-200 placeholder-gray-500 focus:border-[#629aa9] focus:ring-2 focus:ring-[#629aa9]"
        />

        {/* Social fields */}
        <div className="w-full space-y-3 mt-6">
          <h2 className="text-lg font-semibold text-white mb-2">Social Links</h2>
          {socials.map(({ key }) => (
            <input
              key={key}
              type="text"
              value={(profile[key as keyof Profile] as string) || ''}
              onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
              placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)} handle or URL`}
              className="w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-gray-200 placeholder-gray-500 focus:border-[#629aa9] focus:ring-2 focus:ring-[#629aa9]"
            />
          ))}
        </div>

        {/* Live color preview */}
        {activeSocials.length > 0 && (
          <div className="flex gap-5 mt-4">
            {activeSocials.map(({ key, icon: Icon, color }) => (
              <a
                key={key}
                href={normalizeSocialLink(key, profile[key as keyof Profile] as string)}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
                style={{ color }}
              >
                <Icon size={22} />
              </a>
            ))}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className={`mt-5 w-full rounded-md py-3 font-semibold text-white transition ${
            saving
              ? 'bg-gray-700 cursor-not-allowed text-gray-400'
              : 'bg-[#629aa9] hover:bg-[#4f7f86]'
          }`}
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>

        <button
          onClick={() => router.push('/profile')}
          className="text-sm text-gray-400 hover:text-[#629aa9] mt-3 transition"
        >
          ← Back to Profile
        </button>
      </div>
    </main>
  );
}
