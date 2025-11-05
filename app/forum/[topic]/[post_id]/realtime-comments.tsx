'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'react-hot-toast';

interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  post_id?: string;
}

export default function RealtimeComments({
  initialComments,
  postId,
}: {
  initialComments: Comment[];
  postId: string;
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState<any>(null);

  // Load user + subscribe to comment stream
  useEffect(() => {
    let active = true;

    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (active) setUser(data?.user);
    };
    loadUser();

    const channel = supabase
      .channel(`comments_stream_${postId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments' },
        (payload) => {
          const comment = payload.new as Comment;
          if (comment.post_id === postId) {
            setComments((prev) => [...prev, comment]);
          }
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = newComment.trim();
    if (!content) return;

    setNewComment('');

    const optimisticComment: Comment = {
      id: crypto.randomUUID(),
      content,
      user_id: user?.id || 'anon',
      created_at: new Date().toISOString(),
      post_id: postId,
    };

    // Optimistic UI update
    setComments((prev) => [...prev, optimisticComment]);

    const { error } = await supabase
      .from('comments')
      .insert([{ post_id: postId, user_id: user?.id, content }]);

    if (error) {
      console.error('Error adding comment:', error.message);
      toast.error('Failed to post comment.');
      setComments((prev) => prev.filter((c) => c.id !== optimisticComment.id));
    } else {
      toast.success('Comment added!');
    }
  };

  return (
    <div className="mt-8">
      <ul className="space-y-4 mb-6">
        {comments.map((comment) => (
          <li
            key={comment.id}
            className="rounded-md border border-gray-800 bg-gray-950 p-4 text-gray-300"
          >
            <p className="whitespace-pre-line">{comment.content}</p>
            <div className="mt-2 text-sm text-gray-500">
              {new Date(comment.created_at).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>

      {user ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#629aa9]"
            rows={3}
          />
          <button
            type="submit"
            className="rounded bg-[#629aa9] px-6 py-2 font-semibold text-white hover:bg-[#4f7f86] transition disabled:opacity-50"
            disabled={!newComment.trim()}
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
