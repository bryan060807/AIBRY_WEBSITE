// app/forum/hope/page.tsx

import NewPostForm from '@/components/NewPostForm';
import Link from 'next/link';
import { createServerSideClient } from '@/utils/supabase/server';

export const metadata = {
  title: "Finding Hope | AIBRY",
  description: "A space for the AIBRY community to share positive moments, celebrate progress, and discuss coping mechanisms.",
};

// Define the static topic for this page
const CURRENT_TOPIC = "hope";

// FIX 1: Define the explicit type for a single post item returned by the select query
interface PostType {
    id: number;
    content: string;
    created_at: string;
    topic: string;
    title: string;
    // This correctly types the joined user data as an array
    user_id: [{ display_name: string }] | null; 
}


export default async function HopePage() {
  const supabase = await createServerSideClient();
  
  // Query for posts matching the CURRENT_TOPIC
  const { data: postsData, error } = await supabase // Renamed variable to clearly separate data from type
    .from('posts')
    .select('id, content, created_at, topic, title, user_id:profiles!inner(display_name)')
    .eq('topic', CURRENT_TOPIC)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return <div>Error loading posts. Please check RLS policies and database configuration.</div>;
  }

  // Apply type casting to ensure TypeScript uses the correct PostType
  const posts: PostType[] = postsData as PostType[] || [];

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/forum" className="mb-8 inline-block text-gray-400 hover:text-white transition">
        &larr; Back to Forum Home
      </Link>
      
      <h1 className="mb-2 text-4xl font-bold text-white">Finding Hope</h1>
      <p className="mb-10 text-lg text-gray-400">
        A space for sharing positive moments, celebrating progress, and discussing coping mechanisms. Click a title to read more.
      </p>

      {/* Post Submission Form: Pass the correct, static topic here */}
      <NewPostForm topic={CURRENT_TOPIC} />

      {/* List of Posts (Discord/Reddit Style Feed) */}
      <section className="mt-8 space-y-3">
        {posts.length > 0 ? (
          posts.map((post) => (
            // Each post title is now a clickable link to the detail page
            <Link 
              key={post.id} 
              href={`/forum/${post.topic}/${post.id}`} 
              className="block rounded-lg bg-[#18181b] p-4 text-left shadow-md transition border-l-4 border-l-transparent hover:border-l-[#629aa9] hover:bg-gray-800"
            >
              <div className="flex justify-between items-start">
                  {/* Thread Title: Large and Primary */}
                  <h3 className="text-xl font-semibold text-white truncate pr-4">
                      {post.title}
                  </h3>
                  {/* Metadata: Smaller, less prominent, and right-aligned */}
                  <p className="text-xs text-gray-500 whitespace-nowrap pt-1">
                      {new Date(post.created_at).toLocaleDateString()}
                  </p>
              </div>
              
              <p className="mt-1 text-sm text-gray-400">
                {/* FIX 2: Safely access the display_name from the first element of the array */}
                ```tsx
                Started by **{post.user_id?.[0]?.display_name || 'Anonymous'}**
              </p>
            </Link>
          ))
        ) : (
          <p className="pt-8 text-center text-gray-500">No threads have been started yet. Be the first to share a positive thought!</p>
        )}
      </section>
    </main>
  );
}
