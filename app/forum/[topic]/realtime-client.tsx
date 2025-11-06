'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const LikeButton = dynamic(() => import('@/components/ui/LikeButton'), { ssr: false });

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  created_at: string;
  topic: string;
}

export default function ClientRealtimePosts({ initialPosts, topic }: { initialPosts: Post[]; topic: string }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const channel = supabase
      .channel('posts-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, (payload) => {
        const newPost = payload.new as Post;
        if (newPost.topic === topic) {
          setPosts((prev) => [newPost, ...prev]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [topic]);

  if (posts.length === 0) {
    return (
      <p className="text-gray-500 italic">No posts yet. Be the first to start a discussion.</p>
    );
  }

  return (
    <section aria-label="Forum posts" className="space-y-6">
      {loading && (
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-800 rounded-lg" />
          ))}
        </div>
      )}

      {posts.map((post) => (
        <article
          key={post.id}
          aria-label={post.title}
          className="rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-md transition hover:shadow-lg hover:border-blue-400"
        >
          <Link href={`/forum/${topic}/${post.id}`}>
            <h2 className="text-xl font-semibold text-white hover:text-blue-400 transition-colors">
              {post.title}
            </h2>
          </Link>

          <p className="mt-2 text-gray-400 line-clamp-3">{post.content}</p>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <span>
              Posted by <span className="text-gray-300 font-medium">{post.author}</span> ·{' '}
              {new Date(post.created_at).toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </span>
            <LikeButton postId={post.id} />
          </div>
        </article>
      ))}
    </section>
  );
}

