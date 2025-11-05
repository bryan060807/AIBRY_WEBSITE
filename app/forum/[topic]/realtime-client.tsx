'use client';

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/utils/supabase/client';
import Link from 'next/link';
import LikeButton from '@/components/ui/LikeButton'; // optional if you’re showing likes

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  created_at: string;
  topic: string;
}

export default function ClientRealtimePosts({
  initialPosts,
  topic,
}: {
  initialPosts: Post[];
  topic: string;
}) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const supabase = createSupabaseBrowserClient();  

  useEffect(() => {
    const channel = supabase
      .channel('posts_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        (payload) => {
          const newPost = payload.new as Post;
          if (newPost.topic === topic) {
            setPosts((prev) => [newPost, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, topic]);

  if (posts.length === 0) {
    return (
      <p className="text-gray-500">
        No posts yet. Be the first to start a discussion.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <article
          key={post.id}
          className="rounded-lg border border-gray-800 bg-gray-900 p-6 shadow transition hover:shadow-md"
        >
          <Link href={`/forum/${topic}/${post.id}`}>
            <h2 className="text-xl font-semibold text-white hover:text-[#629aa9] transition">
              {post.title}
            </h2>
          </Link>
          <p className="mt-2 text-gray-400 line-clamp-3">{post.content}</p>
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <span>
              Posted by <span className="text-gray-300">{post.author}</span> •{' '}
              {new Date(post.created_at).toLocaleDateString()}
            </span>
            {/* Optional like button if you want it on the list */}
            <LikeButton postId={post.id} />
          </div>
        </article>
      ))}
    </div>
  );
}
