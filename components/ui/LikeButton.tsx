'use client';

import { useState, useTransition } from 'react';
import { Heart } from 'lucide-react';
import { toggleLike } from '@/actions/comment-actions';

/**
 * LikeButton
 * Reusable component for liking posts or comments.
 * Server-action like toggle for forum comments. Final authorization happens
 * server-side in the forum adapter.
 */

interface LikeButtonProps {
  commentId: string;
  postId: string;
  topic: string;
  initialCount?: number;
  initialLiked?: boolean;
}

export default function LikeButton({
  commentId,
  postId,
  topic,
  initialCount = 0,
  initialLiked = false,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setCount((current) => (nextLiked ? current + 1 : Math.max(0, current - 1)));

    startTransition(async () => {
      await toggleLike(commentId, topic, postId, liked);
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#629aa9] transition"
    >
      <Heart
        className={`w-5 h-5 ${
          liked ? 'fill-[#629aa9] text-[#629aa9]' : 'text-gray-400'
        }`}
      />
      <span>{count}</span>
    </button>
  );
}
