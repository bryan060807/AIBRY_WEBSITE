'use client';

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/utils/supabase/client';

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
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    // Load user
    supabase.auth.getUser().then(({ data }) => setUser(data?.user));

    // Subscribe to new comments in real time
    const channel = supabase
      .channel('comments_stream')
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
      supabase.removeChannel(channel);
    };
  }, [postId, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const content = newComment.trim();
    setNewComment('');

    // Optimistic render
    const optimisticComment = {
      id: crypto.randomUUID(),
      content,
      user_id: user?.id || 'anon',
      created_at: new Date().toISOString(),
      post_id: postId,
    };
    setComments((prev) => [...prev, optimisticComment]);

    const { error } = await supabase
      .from('comments')
      .insert([{ post_id: postId, user_id: user?.id, content }]);

    if (error) console.error('Error adding comment:', error.message);
  };

  return (
    <div>
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
            className="w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-white placeholder-gray-500"
            rows={3}
          />
          <button
            type="submit"
            className="rounded bg-[#629aa9] px-6 py-2 font-semibold text-white hover:bg-[#4f7f86]"
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
