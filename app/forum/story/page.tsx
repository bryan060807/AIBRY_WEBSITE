import NewPostForm from '@/components/NewPostForm';
import Link from 'next/link';
import { createServerSideClient } from '@/utils/supabase/server';

export const metadata = {
  title: "Share Your Story | AIBRY",
  description: "A safe space for the AIBRY community to share their personal stories about mental health and recovery.",
};

// Define the static topic for this page
const CURRENT_TOPIC = "story";

export default async function StoryPage() {
  const supabase = await createServerSideClient();
  
  // Query for posts matching the CURRENT_TOPIC
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, content, created_at, topic, title, user_id:profiles!inner(display_name)')
    .eq('topic', CURRENT_TOPIC)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return <div>Error loading posts. Please check RLS policies and database configuration.</div>;
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/forum" className="mb-8 inline-block text-gray-400 hover:text-white transition">
        &larr; Back to Forum Home
      </Link>
      
      <h1 className="mb-2 text-4xl font-bold text-white">Share Your Story</h1>
      <p className="mb-10 text-lg text-gray-400">
        A place to connect and share personal journeys. Click a title to read more.
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
              // Ensure the link uses the topic saved in the database (which should be correct now)
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
                Started by **{post.user_id?.display_name || 'Anonymous'}**
              </p>
            </Link>
          ))
        ) : (
          <p className="pt-8 text-center text-gray-500">No stories have been posted yet. Start the first thread!</p>
        )}
      </section>
    </main>
  );
}