// app/dashboard/UserActivity.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
// We'll import these types from the page component in the next step
import { type UserPost, type UserComment } from './page';

interface UserActivityProps {
  posts: UserPost[];
  comments: UserComment[];
}

type View = 'posts' | 'comments';

export default function UserActivity({ posts, comments }: UserActivityProps) {
  const [view, setView] = useState<View>('posts');

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setView('posts')}
          className={`py-2 px-4 font-semibold ${
            view === 'posts' ? 'border-b-2 border-[#629aa9] text-white' : 'text-gray-500'
          }`}
        >
          My Threads ({posts.length})
        </button>
        <button
          onClick={() => setView('comments')}
          className={`py-2 px-4 font-semibold ${
            view === 'comments' ? 'border-b-2 border-[#629aa9] text-white' : 'text-gray-500'
          }`}
        >
          My Replies ({comments.length})
        </button>
      </div>

      {/* Content Area */}
      <div className="space-y-4">
        {view === 'posts' && (
          posts.length > 0 ? (
            posts.map(post => (
              <Link 
                key={post.id} 
                href={`/forum/${post.topic}/${post.id}`}
                className="block rounded-lg bg-gray-900 p-4 border border-gray-800 transition hover:border-[#629aa9]"
              >
                <h3 className="font-semibold text-white truncate">{post.title}</h3>
                <p className="text-sm text-gray-400">
                  Posted in <span className="capitalize">{post.topic}</span> on {new Date(post.created_at).toLocaleDateString()}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-gray-500">You have not created any threads yet.</p>
          )
        )}

        {view === 'comments' && (
          comments.length > 0 ? (
            comments.map(comment => (
              <Link 
                key={comment.id}
                // This link will take the user to the post the comment is on
                href={`/forum/${comment.posts.topic}/${comment.posts.id}`} 
                className="block rounded-lg bg-gray-900 p-4 border border-gray-800 transition hover:border-[#629aa9]"
              >
                <p className="text-gray-300 line-clamp-2">
                  {comment.content}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Replied to <span className="font-semibold text-gray-300">{comment.posts.title}</span> on {new Date(comment.created_at).toLocaleDateString()}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-gray-500">You have not replied to any threads yet.</p>
          )
        )}
      </div>
    </div>
  );
}