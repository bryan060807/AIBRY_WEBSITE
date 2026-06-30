"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, Loader2, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { getCurrentProfile, updateProfile } from "@/lib/auth/client";
import {
  previewAvatar,
  removeAvatar,
  uploadAvatar,
  validateAvatarFile,
} from "@/lib/storage/avatarClient";
import type { WebsiteProfile } from "@/lib/websiteProfile";
import { useAuth } from "@/hooks/useAuth";

type FormState = {
  displayName: string;
  username: string;
  bio: string;
  instagram: string;
  tiktok: string;
  spotify: string;
  soundcloud: string;
  facebook: string;
  bandcamp: string;
  newsletterOptIn: boolean;
};

const emptyForm: FormState = {
  displayName: "",
  username: "",
  bio: "",
  instagram: "",
  tiktok: "",
  spotify: "",
  soundcloud: "",
  facebook: "",
  bandcamp: "",
  newsletterOptIn: false,
};

export default function ProfileSettings({
  canModerateForum = false,
}: {
  canModerateForum?: boolean;
}) {
  const { applyProfile, refresh } = useAuth();
  const [profile, setProfile] = useState<WebsiteProfile | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getCurrentProfile()
      .then((nextProfile) => {
        if (cancelled) return;
        if (!nextProfile) {
          setError("Profile details could not be loaded for this session.");
          return;
        }
        setProfile(nextProfile);
        setForm(toForm(nextProfile));
        applyProfile(nextProfile);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to load profile.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, [applyProfile]);

  const initials = useMemo(
    () => getInitials(form.displayName || form.username || profile?.email || "AIBRY"),
    [form.displayName, form.username, profile?.email]
  );

  async function submitProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const nextProfile = await updateProfile({
        displayName: form.displayName.trim(),
        username: form.username.trim(),
        bio: form.bio.trim(),
        instagram: form.instagram.trim(),
        tiktok: form.tiktok.trim(),
        spotify: form.spotify.trim(),
        soundcloud: form.soundcloud.trim(),
        facebook: form.facebook.trim(),
        bandcamp: form.bandcamp.trim(),
        newsletterOptIn: form.newsletterOptIn,
      });
      if (nextProfile) {
        setProfile(nextProfile);
        setForm(toForm(nextProfile));
        applyProfile(nextProfile);
        await refresh();
        applyProfile(nextProfile);
      }
      toast.success("Profile updated.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to update profile.";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatar(file: File | null) {
    if (!file) return;
    const validationError = validateAvatarFile(file);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    const nextPreview = previewAvatar(file);
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = nextPreview;
    setPreviewUrl(nextPreview);
    setAvatarBusy(true);
    setError(null);

    try {
      const nextProfile = await uploadAvatar(file);
      if (nextProfile) {
        setProfile(nextProfile);
        setForm(toForm(nextProfile));
        applyProfile(nextProfile);
        await refresh();
        applyProfile(nextProfile);
      }
      toast.success("Avatar updated.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Avatar upload failed.";
      setError(message);
      toast.error(message);
    } finally {
      setAvatarBusy(false);
    }
  }

  async function handleRemoveAvatar() {
    setAvatarBusy(true);
    setError(null);
    try {
      const nextProfile = await removeAvatar();
      if (nextProfile) {
        setProfile(nextProfile);
        setForm(toForm(nextProfile));
        applyProfile(nextProfile);
        await refresh();
        applyProfile(nextProfile);
      }
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
      setPreviewUrl(null);
      toast.success("Avatar removed.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Avatar removal failed.";
      setError(message);
      toast.error(message);
    } finally {
      setAvatarBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[360px] max-w-4xl items-center justify-center text-gray-300">
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#629aa9]" />
        Loading profile
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl rounded-md border border-red-900/70 bg-red-950/30 p-6 text-red-100">
        {error || "Profile unavailable."}
      </div>
    );
  }

  const avatarSrc = previewUrl || profile.avatarUrl;
  const hasAvatar = avatarSrc && avatarSrc !== "/images/default-avatar.png";

  return (
    <form onSubmit={submitProfile} className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-6 border-b border-gray-800 pb-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[#629aa9]">Account</p>
          <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">Profile</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
            Manage the public profile fields stored by the Fedora website backend.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#629aa9] px-5 py-2 text-sm font-semibold text-black transition hover:bg-[#7ab3c0] focus:outline-none focus:ring-2 focus:ring-[#629aa9] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save profile
        </button>
      </div>

      {error ? (
        <p className="mb-6 rounded-md border border-red-900/70 bg-red-950/30 px-4 py-3 text-sm text-red-100">
          {error}
        </p>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <section className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-col items-center gap-4 rounded-md border border-gray-800 bg-gray-950/60 p-6">
            <div className="grid h-32 w-32 place-items-center overflow-hidden rounded-full border border-gray-700 bg-[#1f3b43] text-3xl font-semibold text-white">
              {hasAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarSrc} alt="Current profile avatar" className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="flex w-full flex-col gap-2">
              <label className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-gray-700 px-3 py-2 text-sm text-gray-100 transition hover:border-[#629aa9] focus-within:ring-2 focus-within:ring-[#629aa9]">
                {avatarBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                Replace avatar
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={(event) => handleAvatar(event.target.files?.[0] ?? null)}
                  disabled={avatarBusy}
                />
              </label>
              <button
                type="button"
                onClick={handleRemoveAvatar}
                disabled={avatarBusy}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm text-gray-300 transition hover:bg-gray-900 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-[#629aa9] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />
                Remove avatar
              </button>
            </div>
            <p className="text-center text-xs leading-5 text-gray-500">
              JPG, PNG, or WebP. Maximum 5 MB.
            </p>
          </div>

          {canModerateForum ? (
            <Link
              href="/forum/admin"
              className="mt-4 flex items-center gap-3 rounded-md border border-[#629aa9]/40 bg-[#629aa9]/10 p-4 text-sm text-gray-200 transition hover:border-[#629aa9] hover:bg-[#629aa9]/20"
            >
              <ShieldCheck className="h-5 w-5 text-[#83c0cc]" aria-hidden="true" />
              <span>
                <span className="block font-semibold text-white">Forum Admin</span>
                <span className="text-gray-400">Moderate topics, threads, and replies.</span>
              </span>
            </Link>
          ) : null}
        </section>

        <section className="grid gap-5 sm:grid-cols-2">
          <Field label="Display name" value={form.displayName} onChange={(displayName) => setForm({ ...form, displayName })} />
          <Field label="Username" value={form.username} onChange={(username) => setForm({ ...form, username })} />
          <label className="sm:col-span-2">
            <span className="mb-2 block text-sm font-medium text-gray-200">Bio</span>
            <textarea
              value={form.bio}
              onChange={(event) => setForm({ ...form, bio: event.target.value })}
              rows={5}
              className="w-full rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-gray-100 outline-none transition placeholder:text-gray-600 focus:border-[#629aa9] focus:ring-2 focus:ring-[#629aa9]/40"
            />
          </label>
          <Field label="Instagram" value={form.instagram} onChange={(instagram) => setForm({ ...form, instagram })} />
          <Field label="TikTok" value={form.tiktok} onChange={(tiktok) => setForm({ ...form, tiktok })} />
          <Field label="Spotify" value={form.spotify} onChange={(spotify) => setForm({ ...form, spotify })} />
          <Field label="SoundCloud" value={form.soundcloud} onChange={(soundcloud) => setForm({ ...form, soundcloud })} />
          <Field label="Bandcamp" value={form.bandcamp} onChange={(bandcamp) => setForm({ ...form, bandcamp })} />
          <Field label="Facebook" value={form.facebook} onChange={(facebook) => setForm({ ...form, facebook })} />
          <label className="flex min-h-11 items-center gap-3 rounded-md border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-gray-200">
            <input
              type="checkbox"
              checked={form.newsletterOptIn}
              onChange={(event) => setForm({ ...form, newsletterOptIn: event.target.checked })}
              className="h-4 w-4 rounded border-gray-700 bg-black text-[#629aa9] focus:ring-[#629aa9]"
            />
            Newsletter opt-in
          </label>
        </section>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-medium text-gray-200">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-md border border-gray-800 bg-gray-950 px-3 text-gray-100 outline-none transition placeholder:text-gray-600 focus:border-[#629aa9] focus:ring-2 focus:ring-[#629aa9]/40"
      />
    </label>
  );
}

function toForm(profile: WebsiteProfile): FormState {
  return {
    displayName: profile.displayName ?? "",
    username: profile.username ?? "",
    bio: profile.bio ?? "",
    instagram: profile.instagram ?? "",
    tiktok: profile.tiktok ?? "",
    spotify: profile.spotify ?? "",
    soundcloud: profile.soundcloud ?? "",
    facebook: profile.facebook ?? "",
    bandcamp: profile.bandcamp ?? "",
    newsletterOptIn: profile.newsletterOptIn,
  };
}

function getInitials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
