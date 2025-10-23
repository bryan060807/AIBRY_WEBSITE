// app/forum/[topic]/[post_id]/page.tsx

// Assuming necessary imports for the page structure
import React from 'react';
import { createServerSideClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';


interface PostPageProps {
  params: {
    topic: string;
    post_id: string;
  };
}

// Define the shape of the data returned from Supabase, ensuring user_id is typed correctly
interface PostType {
    id: number;
    title: string;
    content: string;
    created_at: string;
    user_id: [{ display_name: string }] | null; // Correctly typed as an array of objects
}


export default async function PostPage({ params }: PostPageProps) {
  // FIX: MUST await the creation of the server-side Supabase client.
  // The client function returns a Promise, and we must resolve it before calling .from()
  const supabase = await createServerSideClient();

  const { data: post, error } = await supabase
    .from('forum_posts')
    .select('*, user_id(display_name)') // Selects post fields and joins user display_name
    .eq('id', params.post_id)
    .single<PostType>(); // Cast the result to the expected type

  if (error || !post) {
    console.error('Error fetching post:', error);
    return notFound();
  }

  // Determine the display name: safely access the display_name from the first element of the user_id array
  // This was the fix for the previous build error.
  const authorName = post.user_id?.[0]?.display_name || 'Anonymous';


  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="bg-gray-900 p-6 sm:p-8 rounded-xl shadow-2xl">
        
        {/* Post Title and Metadata */}
        <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>
        <p className="mb-6 text-sm text-gray-500">
          Posted by **{authorName}** on {new Date(post.created_at).toLocaleDateString()}
        </p>
        
        <hr className="border-gray-800 mb-6" />
        
        {/* Post Content */}
        <div className="prose prose-invert max-w-none text-gray-300">
          <p>{post.content}</p>
        </div>

        {/* Placeholder for Comments Section */}
        <div className="mt-12 pt-6 border-t border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Comments</h2>
            <p className="text-gray-500">Comment section coming soon...</p>
        </div>
        
      </div>
    </main>
  );
}