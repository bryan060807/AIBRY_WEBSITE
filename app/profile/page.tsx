'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
  const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Please log in to access your profile.');
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error(error);
      toast.error('Error loading profile');
    } else {
      setProfile(data);
      setAvatarUrl(data.avatar_url);
    }
    setLoading(false);
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      setAvatarUrl(publicUrl);
      setFile(file);
      toast.success('Avatar uploaded!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return toast.error('Not logged in.');

    const updates = {
      id: user.id,
      username: profile.username,
      full_name: profile.full_name,
      bio: profile.bio,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('profiles').upsert(updates);

    if (error) {
      console.error(error);
      toast.error('Error saving profile');
    } else {
      toast.success('Profile updated successfully!');
      setProfile({ ...profile, avatar_url: avatarUrl });
    }
  };

  if (loading)
    return (
      <main className="flex justify-center items-center h-screen text-gray-400">
        Loading profile...
      </main>
    );

  if (!profile)
    return (
      <main className="flex justify-center items-center h-screen text-gray-400">
        No profile found.
      </main>
    );

  return (
    <main className="max-w-2xl mx-auto mt-16 px-6 text-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-center">My Profile</h1>

      <div className="flex flex-col items-center gap-6 mb-8">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="Avatar"
            width={120}
            height={120}
            className="rounded-full border border-gray-700 shadow-md object-cover"
          />
        ) : (
          <div className="w-[120px] h-[120px] rounded-full border border-gray-700 flex items-center justify-center text-gray-500">
            No Avatar
          </div>
        )}
        <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-sm px-4 py-2 rounded-md transition">
          {uploading ? 'Uploading...' : 'Upload Avatar'}
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Username
          </label>
          <input
            type="text"
            value={profile.username || ''}
            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            placeholder="Username"
            className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500 focus:border-[var(--color-accent)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={profile.full_name || ''}
            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
            placeholder="Your full name"
            className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500 focus:border-[var(--color-accent)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Bio
          </label>
          <textarea
            rows={4}
            value={profile.bio || ''}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            placeholder="Write something about yourself..."
            className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500 resize-none focus:border-[var(--color-accent)]"
          />
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={handleSave}
          disabled={uploading}
          className="rounded bg-[var(--color-accent)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--color-accent-hover)] disabled:opacity-50"
        >
          {uploading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </main>
  );
}
