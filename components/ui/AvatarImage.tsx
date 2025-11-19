"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";

interface AvatarImageProps {
  userId: string | null;
  size?: number;
  className?: string;
  alt?: string;
}

export function AvatarImage({
  userId,
  size = 120,
  className = "",
  alt = "User avatar",
}: AvatarImageProps) {
  const [imgSrc, setImgSrc] = useState("/images/default-avatar.png");

  useEffect(() => {
    if (!userId) return;

    async function loadAvatar() {
      try {
        // 1️⃣ Try to get avatar_url from profile table
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", userId)
          .single();

        if (profileError) {
          console.warn("No profile record found:", profileError.message);
        }

        if (profile?.avatar_url) {
          setImgSrc(profile.avatar_url);
          return;
        }

        // 2️⃣ If no avatar_url in DB, fetch from storage
        const { data: files, error: listError } = await supabase.storage
          .from("avatars")
          .list(`avatars/${userId}`, { limit: 1 });

        if (listError) {
          console.error("Error listing avatars:", listError);
          return;
        }

        if (files && files.length > 0) {
          const filePath = `avatars/${userId}/${files[0].name}`;
          const { data: { publicUrl } } = supabase.storage
            .from("avatars")
            .getPublicUrl(filePath);

          setImgSrc(publicUrl);
        }
      } catch (err: any) {
        console.error("Error loading avatar:", err.message);
      }
    }

    loadAvatar();
  }, [userId]);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={size}
      height={size}
      onError={() => setImgSrc("/images/default-avatar.png")}
      className={`rounded-full border border-[#83c0cc] object-cover ${className}`}
    />
  );
}
