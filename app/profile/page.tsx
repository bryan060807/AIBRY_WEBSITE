import { createSupabaseServerClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { normalizeAvatarUrl } from "@/lib/normalizeAvatarUrl";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = createSupabaseServerClient();

  // 1. Get current authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-gray-400">
        <p>You must be signed in to view this page.</p>
      </main>
    );
  }

  // 2. Fetch user profile data
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      "id, display_name, bio, avatar_url, instagram, tiktok, spotify, soundcloud, facebook"
    )
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error loading profile:", profileError.message);
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-gray-400">
        <p>Error loading profile data.</p>
      </main>
    );
  }

  // 3. Normalize avatar safely (handles Supabase + local fallback)
  const avatarUrl =
    normalizeAvatarUrl(profile.avatar_url) || "/images/default-avatar.png";

  return (
    <main className="min-h-screen bg-black text-gray-100 py-24 px-6 flex flex-col items-center">
      <div className="max-w-xl text-center">
        {/* Avatar */}
        <Image
          src={avatarUrl}
          alt={`${profile.display_name || "User"}'s avatar`}
          width={160}
          height={160}
          className="rounded-full border border-[#83c0cc] mx-auto mb-6 object-cover"
          priority
        />

        {/* Display Name */}
        <h1 className="text-4xl font-bold text-[#83c0cc] mb-2">
          {profile.display_name || "Unnamed User"}
        </h1>

        {/* Bio */}
        <p className="text-gray-400 mb-6 whitespace-pre-line">
          {profile.bio || "No bio yet."}
        </p>

        {/* Social Links */}
        <div className="flex flex-wrap justify-center gap-4 text-[#83c0cc] mb-8">
          {profile.instagram && (
            <Link
              href={profile.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </Link>
          )}
          {profile.tiktok && (
            <Link
              href={profile.tiktok}
              target="_blank"
              rel="noopener noreferrer"
            >
              TikTok
            </Link>
          )}
          {profile.spotify && (
            <Link
              href={profile.spotify}
              target="_blank"
              rel="noopener noreferrer"
            >
              Spotify
            </Link>
          )}
          {profile.soundcloud && (
            <Link
              href={profile.soundcloud}
              target="_blank"
              rel="noopener noreferrer"
            >
              SoundCloud
            </Link>
          )}
          {profile.facebook && (
            <Link
              href={profile.facebook}
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </Link>
          )}
        </div>

        {/* Edit Profile Button */}
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
