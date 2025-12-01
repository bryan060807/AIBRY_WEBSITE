"use client";

import Image from "next/image";
import { useState } from "react";

interface AvatarBaseProps {
  src?: string | null;
  alt?: string;
  size?: number;
  bordered?: boolean;
  className?: string;
}

/**
 * AvatarBase
 * 
 * A shared, reusable avatar renderer with built-in fallback handling.
 * - Handles broken images gracefully (no onError SSR issues)
 * - Works for Dashboard, UserMenu, Profile, etc.
 * - Provides consistent sizing, borders, and transitions.
 */
export function AvatarBase({
  src,
  alt = "User avatar",
  size = 80,
  bordered = true,
  className = "",
}: AvatarBaseProps) {
  const [errored, setErrored] = useState(false);
  const fallback = "/images/default-avatar.png";
  const displaySrc = errored || !src ? fallback : src;

  return (
    <Image
      src={displaySrc}
      alt={alt}
      width={size}
      height={size}
      className={[
        "object-cover rounded-full transition-all duration-200",
        bordered && "border border-gray-700 hover:scale-[1.02]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onError={() => setErrored(true)}
      priority
    />
  );
}
