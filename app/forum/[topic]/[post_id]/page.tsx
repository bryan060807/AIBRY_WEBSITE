// app/forum/[topic]/[post_id]/page.tsx

import React from 'react';
import { createServerSideClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
// import LikeButton from '@/components/LikeButton'; // DEBUG: Temporarily removed
import NewCommentForm from '@/components/NewCommentForm';

interface PostPageProps {
  params: {
    topic: string;
    post_id: string;
  };
}

// Type for the main post
interface PostType {
  id: number;
  title: string;
  content: string;
  created_at: string;
  topic: string;
  user_id: { display_name: string } | null;
}

// --- DEBUG: CommentType with profile, but NO likes ---
interface CommentType {
  id: number;
  content: string;
  created_at: string;
  user_id: { display_name: string } | null; // from !left join
}

export default async function PostPage({ params }: PostPageProps) {
  const supabase = await createServerSideClient();

  const postIdAsNumber = Number(params.post_id);

  if (isNaN(postIdAsNumber)) {
    console.error("Invalid post ID param:", params.post_id);
    return notFound();
  }

  const { data: { user } } = await supabase.auth.getUser();

  // --- 1. Fetch the Main Post (This query is working) ---
  const { data: post, error: postError } = await supabase
    .from('posts')
    .select('id, title, content, created_at, topic, user_id:profiles!inner(display_name)')
    .eq('id', postIdAsNumber)
    .eq('topic', params.topic)
    .single<PostType>();

  if (postError || !post) {
    console.error('Error fetching post:', postError);
    return notFound();
  }

  // --- 2. Fetch Comments (QUERY WITH PROFILES, NO LIKES) ---
  const { data: commentsData, error: commentsError } = await supabase
    .from('comments')
    // --- DEBUG: Joining profiles, but NOT likes ---
    .select('id, content, created_at, user_id:profiles!left(display_name)') 
    .eq('post_id', postIdAsNumber)
    .order('created_at', { ascending: true });

  if (commentsError) {
    console.error('Error fetching comments:', commentsError);
    // This is why "Failed to load comments" is showing.
  }

  const comments: CommentType[] = (commentsData as unknown as CommentType[]) || [];
  const authorName = post.user_id?.display_name || 'Anonymous';

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      {/* Back link */}
      <Link
        href={`/forum/${post.topic}`}
        className="mb-8 inline-block text-gray-400 hover:text-white transition"
      >
        &larr; Back to {post.topic.charAt(0).toUpperCase() + post.topic.slice(1)}
      </Link>

      {/* --- Main Post --- */}
      <div className="bg-[#18181b] p-6 sm:p-8 rounded-xl shadow-lg border border-gray-800">
        <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>
        <p className="mb-6 text-sm text-gray-500" suppressHydrationWarning>
          Posted by **{authorName}** on {new Date(post.created_at).toLocaleDateString()}
        </p>
        <hr className="border-gray-700 mb-6" />
        <div className="prose prose-invert max-w-none text-gray-300">
          <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
        </div>
      </div>

      {/* --- Comments Section --- */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-white mb-6">
          {comments.length} {comments.length === 1 ? 'Reply' : 'Replies'}
        </h2>

        {/* --- New Comment Form --- */}
        <div className="mb-8 p-5 rounded-lg bg-[#18181b] border border-gray-800">
          {user ? (
            <NewCommentForm postId={post.id.toString()} topic={post.topic} />
          ) : (
            <p className="text-center text-gray-400">
              <Link href={`/login?redirect=/forum/${post.topic}/${post.id}`} className="text-[#629aa9] hover:underline font-semibold">
                Log in
              </Link> to post a reply.
            </p>
          )}
        </div>

        {/* --- List of Comments --- */}
        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map((comment) => {
              const commentAuthor = comment.user_id?.display_name || 'Anonymous'; 
              
              return (
                <div key={comment.id} className="p-5 rounded-lg bg-[#18181b] border border-gray-800">
                  <div className="flex justify-between items-center mb-3">
                    <p className="font-semibold text-white">{commentAuthor}</p>
                    <p className="text-xs text-gray-500" suppressHydrationWarning>
                      {new Date(comment.created_at).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-gray-300 mb-4" style={{ whiteSpace: 'pre-wrap' }}>
                    {comment.content}
                  </p>
                  {/* --- DEBUG: Temporarily removed LikeButton --- */}
                  <p className="text-sm text-gray-600">(Likes disabled for testing)</p>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 pt-4">
              {commentsError ? 'Failed to load comments.' : 'No replies yet.'}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}