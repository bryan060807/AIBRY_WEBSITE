'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface Comment {
  id: string;
  content: string;
  user_id: string;
  display_name: string;
  created_at: string;
  post_id?: string;
}

export default function RealtimeComments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState<string>('Anonymous');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserAndComments = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData?.user || null;
      setUser(currentUser);

      // Fetch user's display_name from profiles table
      if (currentUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', currentUser.id)
          .single();

        if (profile?.display_name) setDisplayName(profile.display_name);
      }

      const { data: initialComments } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      setComments(initialComments || []);
      setLoading(false);
    };

    loadUserAndComments();

    // Subscribe to new comments in realtime
    const channel = supabase
      .channel(`comments-${postId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments' },
        (payload) => {
          const comment = payload.new as Comment;
          if (comment.post_id === postId) {
            setComments((prev) => [comment, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = newComment.trim();
    if (!content) return;

    const optimisticComment: Comment = {
      id: crypto.randomUUID(),
      content,
      user_id: user?.id || 'anon',
      display_name: displayName,
      created_at: new Date().toISOString(),
      post_id: postId,
    };

    // Optimistic UI update
    setComments((prev) => [optimisticComment, ...prev]);
    setNewComment('');

    const { error } = await supabase.from('comments').insert([
      {
        post_id: postId,
        user_id: user?.id,
        display_name: displayName,
        content,
      },
    ]);

    if (error) {
      toast.error('Failed to post comment.');
      setComments((prev) => prev.filter((c) => c.id !== optimisticComment.id));
    } else {
      toast.success('Comment added!');
    }
  };

  return (
    <div className="mt-6">
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-800 rounded-lg" />
          ))}
        </div>
      ) : comments.length > 0 ? (
        <ul className="space-y-4 mb-6">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="border border-gray-800 bg-gray-900 p-4 rounded-md"
            >
              <div className="flex items-center justify-between mb-1">
                <Link
                  href={`/user/${comment.user_id}`}
                  className="font-semibold text-white hover:text-blue-400 transition"
                >
                  {comment.display_name || 'Anonymous'}
                </Link>
                <span className="text-xs text-gray-500">
                  {new Date(comment.created_at).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
              <p className="text-gray-300 whitespace-pre-line">
                {comment.content}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic mb-6">
          No comments yet. Be the first to share your thoughts.
        </p>
      )}

      {user ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            rows={3}
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="rounded-md bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-500 disabled:opacity-50 transition"
          >
            Comment
          </button>
        </form>
      ) : (
        <p className="text-gray-500">Sign in to post a comment.</p>
      )}
    </div>
  );
}
