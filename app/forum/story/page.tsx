// app/forum/[topic]/[post_id]/page.tsx

import React from 'react';
import { createServerSideClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link'; // Import Link

interface PostPageProps {
  params: {
    topic: string;
    post_id: string;
  };
}

// CORRECTED TYPE: Match the other pages (one-to-one join returns an object)
interface PostType {
    id: number;
    title: string;
    content: string;
    created_at: string;
    topic: string;
    // This is the correct type for our join
    user_id: { display_name: string } | null;
}


export default async function PostPage({ params }: PostPageProps) {
  // We MUST await the server-side client
  const supabase = await createServerSideClient();

  // CORRECTED QUERY: Fetch from 'posts' table (not 'forum_posts')
  // and use the same inner join syntax as the list pages.
  const { data: post, error } = await supabase
    .from('posts') 
    .select('id, title, content, created_at, topic, user_id:profiles!inner(display_name)') 
    .eq('id', params.post_id)
    .eq('topic', params.topic) // Good practice to ensure topic matches URL
    .single<PostType>(); // Cast the result to the expected type

  if (error || !post) {
    console.error('Error fetching post:', error);
    return notFound();
  }

  // CORRECTED ACCESS: Access the display_name directly from the object
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

      <div className="bg-[#18181b] p-6 sm:p-8 rounded-xl shadow-lg border border-gray-800">
        
        {/* Post Title and Metadata */}
        <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>
        <p className="mb-6 text-sm text-gray-500">
          Posted by **{authorName}** on {new Date(post.created_at).toLocaleDateString()}
        </p>
        
        <hr className="border-gray-700 mb-6" />
        
        {/* Post Content - Use whitespace-pre-wrap to respect newlines */}
        <div className="prose prose-invert max-w-none text-gray-300">
          <p style={{ whiteSpace: "pre-wrap" }}>{post.content}</p>
        </div>

        {/* Placeholder for Comments Section */}
        <div className="mt-12 pt-6 border-t border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Comments</h2>
            <p className="text-gray-500">Replies and comments coming soon...</p>
        </div>
        
      </div>
    </main>
  );
}