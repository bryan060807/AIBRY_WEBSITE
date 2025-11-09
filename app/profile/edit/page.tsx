'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return router.push('/login');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) console.error('Error loading profile:', error.message);
      setProfile(data);
    }

    loadProfile();
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return router.push('/login');

    let avatarPath = profile.avatar_url;

    if (avatarFile) {
      const ext = avatarFile.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, { upsert: true });

      if (uploadError) {
        console.error('Avatar upload failed:', uploadError.message);
        setSaving(false);
        return;
      }

      avatarPath = filePath;
    }

    const updates = {
      display_name: (e.target as any).display_name.value,
      bio: (e.target as any).bio.value,
      instagram: (e.target as any).instagram.value,
      tiktok: (e.target as any).tiktok.value,
      spotify: (e.target as any).spotify.value,
      facebook: (e.target as any).facebook.value,
      soundcloud: (e.target as any).soundcloud.value,
      newsletter_opt_in: (e.target as any).newsletter_opt_in.checked,
      avatar_url: avatarPath,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      console.error('Profile update failed:', error.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    router.push('/profile');
  };

  if (!profile) {
    return (
      <main className="min-h-screen bg-black text-gray-400 flex items-center justify-center">
        <p>Loading editor...</p>
      </main>
    );
  }

  const avatarUrl =
    avatarPreview ||
    (profile.avatar_url
      ? supabase.storage.from('avatars').getPublicUrl(profile.avatar_url).data.publicUrl
      : '/images/default-avatar.png');

  return (
    <main className="min-h-screen bg-black text-gray-100 py-24 px-6 flex flex-col items-center">
      <form
        onSubmit={handleSave}
        className="max-w-xl w-full bg-gray-900 border border-gray-800 p-8 rounded-2xl space-y-4 shadow-lg"
      >
        <h1 className="text-3xl font-bold text-[#83c0cc] mb-6 text-center">
          Edit Profile
        </h1>

        {/* Avatar Upload */}
        <div className="flex flex-col items-center mb-4">
          <Image
            src={avatarUrl}
            alt="avatar preview"
            width={100}
            height={100}
            className="rounded-full border border-[#83c0cc] mb-3 object-cover"
          />
          <label className="text-sm text-gray-400 cursor-pointer hover:text-[#83c0cc]">
            Change Avatar
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        {/* Display Name */}
        <label className="block text-sm text-gray-300">
          Display Name
          <input
            type="text"
            name="display_name"
            defaultValue={profile.display_name ?? ''}
            className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white"
          />
        </label>

        {/* Bio */}
        <label className="block text-sm text-gray-300">
          Bio
          <textarea
            name="bio"
            defaultValue={profile.bio ?? ''}
            rows={3}
            className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white"
          />
        </label>

        {/* Social Links */}
        <div className="grid md:grid-cols-2 gap-4">
          {['instagram', 'tiktok', 'spotify', 'facebook', 'soundcloud'].map((field) => (
            <label key={field} className="block text-sm text-gray-300 capitalize">
              {field}
              <input
                type="url"
                name={field}
                defaultValue={profile[field] ?? ''}
                placeholder={`https://${field}.com/yourprofile`}
                className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white"
              />
            </label>
          ))}
        </div>

        {/* Newsletter */}
        <label className="flex items-center gap-2 text-sm text-gray-300 mt-4">
          <input
            type="checkbox"
            name="newsletter_opt_in"
            defaultChecked={profile.newsletter_opt_in ?? false}
            className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-[#83c0cc]"
          />
          Subscribe to AIBRY updates
        </label>

        {/* Save */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#83c0cc] hover:bg-[#6eb5c0] text-black font-semibold py-2 rounded-md transition"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </main>
  );
}
