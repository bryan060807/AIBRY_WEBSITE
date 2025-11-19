"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { useAvatar } from "@/context/AvatarContext";
import { motion } from "framer-motion";

interface AvatarImageProps {
  userId: string | null;
  size?: number;
  className?: string;
  alt?: string;
}

/**
 * AvatarImage — Displays a user avatar that automatically updates
 * when the user uploads a new one (via AvatarContext).
 *
 * Data source:
 * - Primary: `profiles.avatar_url`
 * - Fallback: `/images/default-avatar.png`
 */
export function AvatarImage({
  userId,
  size = 120,
  className = "",
  alt = "User avatar",
}: AvatarImageProps) {
  const { avatarUrl } = useAvatar(); // ✅ live global context for instant updates
  const [imgSrc, setImgSrc] = useState("/images/default-avatar.png");

  // ✅ Load avatar from DB when userId or context changes
  useEffect(() => {
    if (!userId) return;

    async function fetchAvatar() {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", userId)
          .single();

        if (error) {
          console.warn("Avatar load warning:", error.message);
          return;
        }

        if (data?.avatar_url) {
          setImgSrc(data.avatar_url);
        } else {
          setImgSrc("/images/default-avatar.png");
        }
      } catch (err: any) {
        console.error("Error fetching avatar:", err.message);
        setImgSrc("/images/default-avatar.png");
      }
    }

    fetchAvatar();
  }, [userId, avatarUrl]); // reacts to both login and avatar updates

  return (
    <motion.div
      key={imgSrc}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`relative inline-block ${className}`}
    >
      <Image
        src={imgSrc || "/images/default-avatar.png"}
        alt={alt}
        width={size}
        height={size}
        onError={() => setImgSrc("/images/default-avatar.png")}
        className="rounded-full border border-[#83c0cc] object-cover shadow-sm"
        priority
      />
    </motion.div>
  );
}
