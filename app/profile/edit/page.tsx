'use client';

import { useEffect, useState, ChangeEvent, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import NextImage from 'next/image';
import Cropper from 'react-easy-crop';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/utils/supabase/client';
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
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const DEFAULT_AVATAR_URL = '/images/default-avatar.png';

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

      if (error && error.code === 'PGRST116') {
        const defaultName = session.user.email?.split('@')[0] || 'User';
        const { error: insertError } = await supabase.from('profiles').insert({
          id: session.user.id,
          display_name: defaultName,
          bio: '',
          avatar_url: DEFAULT_AVATAR_URL,
        });

        if (insertError) {
          toast.error('Failed to create profile.');
          return;
        }

        setProfile({
          id: session.user.id,
          display_name: defaultName,
          bio: '',
          avatar_url: DEFAULT_AVATAR_URL,
        });
        setDisplayName(defaultName);
        toast.success('New profile created!');
        return;
      }

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

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener('load', () => setImageSrc(reader.result as string));
    reader.readAsDataURL(file);
  };

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

  const handleSaveAvatar = async () => {
    if (!profile) return;
    setUploading(true);
    const blob = await getCroppedImage();
    if (!blob) return;

    const fileName = `${uuidv4()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, blob, { upsert: true });

    if (uploadError) {
      toast.error('Avatar upload failed.');
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(fileName);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', profile.id);

    if (updateError) toast.error('Failed to update avatar.');
    else {
      toast.success('Avatar updated!');
      setProfile({ ...profile, avatar_url: publicUrl });
      setAvatarPreview(publicUrl);
      setImageSrc(null);
    }
    setUploading(false);
  };

  const normalizeSocialLink = (platform: string, value: string): string => {
    if (!value) return '';
    const trimmed = value.trim();
    if (trimmed.startsWith('http')) return trimmed;
    const username = trimmed.startsWith('@') ? trimmed.slice(1) : trimmed;

    const patterns: Record<string, string> = {
      instagram: `https://instagram.com/${username}`,
      twitter: `https://twitter.com/${username}`,
      spotify: `https://open.spotify.com/${username}`,
      tiktok: `https://tiktok.com/@${username}`,
      facebook: `https://facebook.com/${username}`,
      soundcloud: `https://soundcloud.com/${username}`,
    };

    return patterns[platform] || trimmed;
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);

    const updated = {
      display_name: displayName,
      bio,
      instagram: normalizeSocialLink('instagram', profile.instagram || ''),
      twitter: normalizeSocialLink('twitter', profile.twitter || ''),
      spotify: normalizeSocialLink('spotify', profile.spotify || ''),
      tiktok: normalizeSocialLink('tiktok', profile.tiktok || ''),
      facebook: normalizeSocialLink('facebook', profile.facebook || ''),
      soundcloud: normalizeSocialLink('soundcloud', profile.soundcloud || ''),
    };

    const { error } = await supabase
      .from('profiles')
      .update(updated)
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
    { key: 'instagram', icon: Instagram },
    { key: 'twitter', icon: Twitter },
    { key: 'spotify', icon: Music2 },
    { key: 'tiktok', icon: Video },
    { key: 'facebook', icon: Facebook },
    { key: 'soundcloud', icon: Music },
  ];

  return (
    <main className="mx-auto max-w-lg px-4 py-12 text-white">
      <h1 className="mb-6 text-2xl font-bold text-[#83c0cc]">Edit Profile</h1>

      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <NextImage
            src={avatarPreview || profile.avatar_url || DEFAULT_AVATAR_URL}
            alt="Avatar"
            width={120}
            height={120}
            className="rounded-full border-2 border-[#83c0cc] object-cover shadow-[0_0_20px_rgba(131,192,204,0.4)]"
          />
          <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-[#83c0cc] p-2 text-black hover:bg-[#6eb5c0] transition">
            <input type="file" accept="image/*" onChange={onFileChange} hidden />
            📸
          </label>
        </div>

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
                onCropComplete={(_, area) => setCroppedAreaPixels(area)}
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
                  disabled={uploading}
                  className="flex-1 bg-[#83c0cc] hover:bg-[#6eb5c0] text-black font-semibold py-2 rounded transition"
                >
                  {uploading ? 'Saving…' : 'Save Avatar'}
                </button>
              </div>
            </div>
          </div>
        )}

        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Display Name"
          className="mt-4 w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-[#83c0cc] outline-none"
        />

        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          placeholder="Write something about yourself..."
          className="mt-4 w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-[#83c0cc] outline-none"
        />

        <div className="w-full space-y-3 mt-6">
          <h2 className="text-lg font-semibold text-white mb-2">Social Links</h2>
          {socials.map(({ key }) => (
            <input
              key={key}
              type="text"
              value={(profile[key as keyof Profile] as string) || ''}
              onChange={(e) =>
                setProfile({ ...profile, [key]: e.target.value })
              }
              placeholder={`${key[0].toUpperCase()}${key.slice(1)} handle or URL`}
              className="w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-[#83c0cc] outline-none"
            />
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className={`mt-5 w-full rounded-md py-3 font-semibold text-white transition ${
            saving
              ? 'bg-gray-700 cursor-not-allowed text-gray-400'
              : 'bg-[#83c0cc] hover:bg-[#6eb5c0] text-black'
          }`}
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>

        <button
          onClick={() => router.push('/profile')}
          className="text-sm text-gray-400 hover:text-[#83c0cc] mt-3 transition"
        >
          ← Back to Profile
        </button>
      </div>
    </main>
  );
}

async function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (err) => reject(err));
    img.src = url;
  });
}
