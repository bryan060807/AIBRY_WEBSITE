'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/utils/supabase/client';
import Cropper from 'react-easy-crop';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';

interface Profile {
  id: string;
  display_name: string;
  email?: string;
  bio?: string;
  avatar_url?: string;
  created_at?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Avatar upload/crop states
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = '/login';
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, email, bio, avatar_url, created_at')
        .eq('id', user.id)
        .single();

      if (error) console.error('Error loading profile:', error.message);
      setProfile(data);
      setLoading(false);
    }

    loadProfile();
  }, []);

  // Handle file upload selection
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImageSrc(reader.result as string);
    });
    reader.readAsDataURL(file);
  };

  // Convert cropped area into a blob for upload
  const getCroppedImage = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return null;

    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const { width, height } = croppedAreaPixels;
    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      width,
      height,
      0,
      0,
      width,
      height
    );

    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
    });
  }, [imageSrc, croppedAreaPixels]);

  // Upload cropped image to Supabase
  const handleSaveAvatar = async () => {
    if (!profile) return;
    setSaving(true);

    const blob = await getCroppedImage();
    if (!blob) return;

    const fileName = `${uuidv4()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, blob, { upsert: true });

    if (uploadError) {
      console.error('Upload failed:', uploadError.message);
      setSaving(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(fileName);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', profile.id);

    if (updateError) console.error('Profile update failed:', updateError.message);

    setProfile({ ...profile, avatar_url: publicUrl });
    setPreviewUrl(publicUrl);
    setImageSrc(null);
    setSaving(false);
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center h-screen text-gray-400">
        Loading profile...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-gray-100 flex flex-col items-center py-16">
      <h1 className="text-3xl font-bold text-[#83c0cc] mb-8">Your Profile</h1>

      {/* Avatar Section */}
      <div className="relative flex flex-col items-center">
        {previewUrl || profile?.avatar_url ? (
          <img
            src={previewUrl || profile?.avatar_url!}
            alt="User avatar"
            className="w-40 h-40 rounded-full border-2 border-[#83c0cc] object-cover shadow-[0_0_20px_rgba(131,192,204,0.4)]"
          />
        ) : (
          <div className="w-40 h-40 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center text-gray-500">
            No Avatar
          </div>
        )}

        <label className="mt-4 bg-[#83c0cc] hover:bg-[#6eb5c0] text-black px-4 py-2 rounded-md cursor-pointer font-semibold transition-colors">
          Change Avatar
          <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
        </label>
      </div>

      {/* Cropping Modal */}
      {imageSrc && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-md bg-black/70">
          <div className="relative w-[90vw] max-w-md h-[70vh] bg-gradient-to-b from-gray-950 via-gray-900 to-black border border-[#83c0cc]/30 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(131,192,204,0.3)]">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, croppedAreaPixels) =>
                setCroppedAreaPixels(croppedAreaPixels)
              }
              cropShape="round"
              showGrid={false}
            />
          </div>
          <div className="flex flex-col gap-3 mt-4 w-full max-w-md text-center">
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-[#83c0cc]"
            />
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setImageSrc(null)}
                className="flex-1 border border-gray-600 text-gray-300 py-2 rounded hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAvatar}
                disabled={saving}
                className="flex-1 bg-[#83c0cc] hover:bg-[#6eb5c0] text-black font-semibold py-2 rounded transition"
              >
                {saving ? 'Saving...' : 'Save Avatar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Info */}
      <div className="mt-10 max-w-lg text-center">
        <h2 className="text-2xl font-semibold mb-2">{profile?.display_name}</h2>
        <p className="text-gray-400 mb-4">{profile?.email}</p>
        {profile?.bio && <p className="text-gray-500 italic">{profile.bio}</p>}
      </div>

      <Link
        href="/dashboard"
        className="mt-8 text-[#83c0cc] hover:text-[#6eb5c0] underline underline-offset-4"
      >
        Back to Dashboard
      </Link>
   
     <div className="mt-10">
  <Link
    href="/profile/edit"
    className="inline-block bg-[#83c0cc] hover:bg-[#6eb5c0] text-black font-semibold px-6 py-3 rounded-lg transition-colors shadow-[0_0_20px_rgba(131,192,204,0.3)]"
  >
    Edit Profile
  </Link>
</div>

    </main>
  );
}

/** Utility: Create an Image from base64 */
async function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (err) => reject(err));
    img.src = url;
  });
}
