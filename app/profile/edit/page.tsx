'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface Profile {
  id: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  instagram?: string;
  twitter?: string;
  spotify?: string;
  tiktok?: string;
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
          'id, display_name, bio, avatar_url, instagram, twitter, spotify, tiktok'
        )
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile.');
      } else {
        setProfile(data);
        setDisplayName(data.display_name || '');
        setBio(data.bio || '');
      }
    }

    fetchProfile();
  }, [router]);

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
    } catch (error: any) {
      console.error(error);
      toast.error('Error uploading avatar.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName,
        bio,
        instagram: profile.instagram,
        twitter: profile.twitter,
        spotify: profile.spotify,
        tiktok: profile.tiktok,
      })
      .eq('id', profile.id);

    if (error) {
      toast.error('Error saving profile.');
    } else {
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

        {/* Social Links */}
        <div className="w-full space-y-3 mt-6">
          <h2 className="text-lg font-semibold text-white mb-2">Social Links</h2>

          <input
            type="text"
            value={profile.instagram || ''}
            onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
            placeholder="Instagram URL"
            className="w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-gray-200 placeholder-gray-500 focus:border-[#629aa9] focus:ring-2 focus:ring-[#629aa9]"
          />
          <input
            type="text"
            value={profile.twitter || ''}
            onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
            placeholder="Twitter URL"
            className="w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-gray-200 placeholder-gray-500 focus:border-[#629aa9] focus:ring-2 focus:ring-[#629aa9]"
          />
          <input
            type="text"
            value={profile.spotify || ''}
            onChange={(e) => setProfile({ ...profile, spotify: e.target.value })}
            placeholder="Spotify URL"
            className="w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-gray-200 placeholder-gray-500 focus:border-[#629aa9] focus:ring-2 focus:ring-[#629aa9]"
          />
          <input
            type="text"
            value={profile.tiktok || ''}
            onChange={(e) => setProfile({ ...profile, tiktok: e.target.value })}
            placeholder="TikTok URL"
            className="w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-gray-200 placeholder-gray-500 focus:border-[#629aa9] focus:ring-2 focus:ring-[#629aa9]"
          />
        </div>

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
