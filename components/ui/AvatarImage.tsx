'use client';

import Image from 'next/image';
import { useState } from 'react';

interface AvatarImageProps {
  src?: string | null;
  alt?: string;
  size?: number;
  className?: string;
}

/**
 * A resilient avatar component that automatically falls back
 * to `/images/default-avatar.png` if the provided image fails to load.
 */
export function AvatarImage({
  src,
  alt = 'User avatar',
  size = 120,
  className = '',
}: AvatarImageProps) {
  const [imgSrc, setImgSrc] = useState(src || '/images/default-avatar.png');

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={size}
      height={size}
      onError={() => setImgSrc('/images/default-avatar.png')}
      className={`rounded-full border border-[#83c0cc] object-cover ${className}`}
    />
  );
}
