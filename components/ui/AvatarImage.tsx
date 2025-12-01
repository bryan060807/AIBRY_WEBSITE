"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { useAvatar } from "@/context/AvatarContext";
import { motion } from "framer-motion";
import { normalizeAvatarUrl } from "@/lib/normalizeAvatarUrl";

/** ============================================================
 * AvatarImage Component
 * ------------------------------------------------------------
 * Fetches and displays a user avatar from Supabase or context.
 * - Fallback: `/images/default-avatar.png`
 * - Smooth fade-in via Framer Motion
 * - Responsive and accessible
 * ============================================================ */

interface AvatarImageProps {
  userId?: string;
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
  const { avatarUrl } = useAvatar();
  const [imgSrc, setImgSrc] = useState("/images/default-avatar.png");

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

        const normalized = normalizeAvatarUrl(data?.avatar_url);
        setImgSrc(normalized || "/images/default-avatar.png");
      } catch (err: any) {
        console.error("Error fetching avatar:", err.message);
        setImgSrc("/images/default-avatar.png");
      }
    }

    fetchAvatar();
  }, [userId, avatarUrl]);

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
        className="rounded-full border border-[#83c0cc] object-cover shadow-sm"
        onError={() => setImgSrc("/images/default-avatar.png")}
        priority
      />
    </motion.div>
  );
}
