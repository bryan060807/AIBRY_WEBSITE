'use client';

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/utils/supabase/client';
import { Heart } from 'lucide-react';

/**
 * LikeButton
 * Reusable component for liking posts or comments.
 * Supports:
 * - Live like counts via Supabase Realtime
 * - Optimistic UI updates
 * - Works for both posts and comments
 */

interface LikeButtonProps {
  postId?: string;
  commentId?: string;
}

export default function LikeButton({ postId, commentId }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState<number>(0);
  const [user, setUser] = useState<any>(null);
  const supabase = createSupabaseBrowserClient();

  // Determine which column to use (post_id or comment_id)
  const column = postId ? 'post_id' : 'comment_id';
  const targetId = postId || commentId;

  // Get current user on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user));
  }, [supabase]);

  // Load like state and count
  useEffect(() => {
    if (!targetId) return;

    const fetchLikes = async () => {
      const { data, error } = await supabase
        .from('likes')
        .select('user_id')
        .eq(column, targetId);

      if (!error && data) {
        setCount(data.length);
        if (user && data.some((row) => row.user_id === user.id)) {
          setLiked(true);
        } else {
          setLiked(false);
        }
      }
    };

    fetchLikes();
  }, [targetId, user, supabase, column]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!targetId) return;

    const channel = supabase
      .channel('likes_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'likes' },
        (payload) => {
          // Cast to Record<string, any> to allow dynamic indexing
          const newData = payload.new as Record<string, any> | null;
          const oldData = payload.old as Record<string, any> | null;
          const affectedId = newData?.[column] ?? oldData?.[column];

          if (affectedId === targetId) {
            // Refresh like count
            supabase
              .from('likes')
              .select('user_id')
              .eq(column, targetId)
              .then(({ data }) => {
                if (data) setCount(data.length);
              });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [targetId, supabase, column]);

  // Handle like toggle
  const toggleLike = async () => {
    if (!user) {
      alert('Sign in to like.');
      return;
    }

    if (liked) {
      setLiked(false);
      setCount((c) => Math.max(0, c - 1));
      await supabase
        .from('likes')
        .delete()
        .eq(column, targetId)
        .eq('user_id', user.id);
    } else {
      setLiked(true);
      setCount((c) => c + 1);
      await supabase
        .from('likes')
        .insert([{ [column]: targetId, user_id: user.id }]);
    }
  };

  return (
    <button
      onClick={toggleLike}
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
