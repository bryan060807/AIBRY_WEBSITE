'use client';

import { useState } from 'react';
import Link from 'next/link';

type Post = {
  id: string;
  title: string;
  topic: string;
  created_at: string;
};

type Comment = {
  id: string;
  content: string;
  created_at: string;
  posts: {
    id: string;
    title: string;
    topic: string;
  };
};

export default function UserActivity({
  posts = [],
  comments = [],
}: {
  posts: Post[];
  comments: Comment[];
}) {
  const [view, setView] = useState<'posts' | 'comments'>('posts');

  const activeTabClasses =
    'text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]';
  const inactiveTabClasses =
    'text-gray-400 hover:text-[var(--color-accent)] border-b-2 border-transparent';

  const renderPosts = () =>
    posts.length > 0 ? (
      posts.map((post) => (
        <Link
          key={post.id}
          href={`/forum/${post.topic}/${post.id}`}
          className="card block rounded-2xl bg-gray-900 p-4 border border-gray-800 transition hover:border-[#629aa9]"
        >
          <h3 className="font-semibold text-white truncate">{post.title}</h3>
          <p className="text-sm text-gray-400">
            Posted in <span className="capitalize">{post.topic}</span> on{' '}
            {new Date(post.created_at).toLocaleDateString()}
          </p>
        </Link>
      ))
    ) : (
      <p className="text-gray-500">You have not created any threads yet.</p>
    );

  const renderComments = () =>
    comments.length > 0 ? (
      comments.map((comment) => (
        <Link
          key={comment.id}
          href={`/forum/${comment.posts.topic}/${comment.posts.id}`}
          className="card block rounded-2xl bg-gray-900 p-4 border border-gray-800 transition hover:border-[#629aa9]"
        >
          <p className="text-gray-300 line-clamp-2">{comment.content}</p>
          <p className="text-sm text-gray-400 mt-2">
            Replied to{' '}
            <span className="font-semibold text-gray-300">
              {comment.posts.title}
            </span>{' '}
            on {new Date(comment.created_at).toLocaleDateString()}
          </p>
        </Link>
      ))
    ) : (
      <p className="text-gray-500">You have not replied to any threads yet.</p>
    );

  return (
    <section className="space-y-6" aria-labelledby="user-activity-title">
      <h2 id="user-activity-title" className="sr-only">
        User Activity
      </h2>

      {/* --- Tab Navigation --- */}
      <nav
        className="flex border-b border-gray-700"
        role="tablist"
        aria-label="User Activity Tabs"
      >
        <button
          role="tab"
          aria-selected={view === 'posts'}
          onClick={() => setView('posts')}
          className={`py-2 px-4 font-semibold transition-colors ${
            view === 'posts' ? activeTabClasses : inactiveTabClasses
          }`}
        >
          My Threads ({posts.length})
        </button>
        <button
          role="tab"
          aria-selected={view === 'comments'}
          onClick={() => setView('comments')}
          className={`py-2 px-4 font-semibold transition-colors ${
            view === 'comments' ? activeTabClasses : inactiveTabClasses
          }`}
        >
          My Replies ({comments.length})
        </button>
      </nav>

      {/* --- Content Area --- */}
      <div
        role="tabpanel"
        className="space-y-4"
        aria-label={view === 'posts' ? 'My Threads' : 'My Replies'}
      >
        {view === 'posts' ? renderPosts() : renderComments()}
      </div>
    </section>
  );
}