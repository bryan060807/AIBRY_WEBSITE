// app/forum/support/page.tsx

import NewPostForm from '@/components/NewPostForm';
import Link from 'next/link';
import { createServerSideClient } from '@/utils/supabase/server';

export const metadata = {
  title: "Ask for Support | AIBRY",
  description: "This is a safe space for the AIBRY community to ask for advice or a listening ear. The community is here for you.",
};

const CURRENT_TOPIC = "support";

// CORRECTED TYPE: The Supabase join returns an object, not an array.
interface PostType {
    id: number;
    content: string;
    created_at: string;
    topic: string;
    title: string;
    // This is the correct type for a one-to-one join
    user_id: { display_name: string } | null; 
}


export default async function SupportPage() {
  const supabase = await createServerSideClient();
  
  const { data: postsData, error } = await supabase
    .from('posts')
    // This query aliases the 'profiles' table data to the 'user_id' key
    .select('id, content, created_at, topic, title, user_id:profiles!inner(display_name)')
    .eq('topic', CURRENT_TOPIC)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return <div>Error loading posts. Please check RLS policies and database configuration.</div>;
  }

  // Apply type casting
  const posts: PostType[] = postsData as PostType[] || [];

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/forum" className="mb-8 inline-block text-gray-400 hover:text-white transition">
        &larr; Back to Forum Home
      </Link>
      
      <h1 className="mb-2 text-4xl font-bold text-white">Ask for Support</h1>
      <p className="mb-10 text-lg text-gray-400">
        This is a safe space to ask for advice or a listening ear. The community is here for you. Click a title to read more.
      </p>

      <NewPostForm topic={CURRENT_TOPIC} />

      <section className="mt-8 space-y-3">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link 
              key={post.id} 
              href={`/forum/${post.topic}/${post.id}`} 
              className="block rounded-lg bg-[#18181b] p-4 text-left shadow-md transition border-l-4 border-l-transparent hover:border-l-[#629aa9] hover:bg-gray-800"
            >
              <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-white truncate pr-4">
                      {post.title}
                D </h3>
                  <p className="text-xs text-gray-500 whitespace-nowrap pt-1">
i                  {new Date(post.created_at).toLocaleDateString()}
                  </p>
              </div>
              
              <p className="mt-1 text-sm text-gray-400">
                {/* CORRECTED ACCESS: Access the 'display_name' property directly from the object */}
                Started by **{post.user_id?.display_name || 'Anonymous'}**
A             </p>
            </Link>
          ))
        ) : (
          <p className="pt-8 text-center text-gray-500">No support requests have been posted yet. Start a new thread!</p>
all       </section>
    </main>
  );
}