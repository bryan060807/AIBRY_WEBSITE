import { createSupabaseServerClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ClientRealtimePosts from './realtime-client';

export const revalidate = 30;

export async function generateMetadata({
  params,
}: {
  params: { topic: string };
}) {
  const topicName = decodeURIComponent(params.topic);
  return {
    title: `${topicName} Forum | AIBRY`,
    description: `Join the discussion on ${topicName}. Share your stories, questions, and insights.`,
  };
}

export default async function TopicPage({
  params,
}: {
  params: { topic: string };
}) {
  const supabase = createSupabaseServerClient();
  const { topic } = params;
  const decodedTopic = decodeURIComponent(topic);

  const { data: posts, error } = await supabase
    .from('posts') // ✅ use correct table name
    .select('id, title, content, author, created_at, topic')
    .eq('topic', decodedTopic)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error.message);
    return notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-6 text-3xl font-bold capitalize text-[#629aa9]">
        {decodedTopic} Forum
      </h1>
      <p className="mb-10 text-gray-400">
        Discuss <span className="font-semibold">{decodedTopic}</span> with the
        community.
      </p>

      <Link
        href={`/forum/${topic}/new`}
        className="inline-block rounded bg-[#629aa9] px-4 py-2 font-semibold text-white hover:bg-[#4f7f86] transition"
      >
        + New Post
      </Link>

      <section className="mt-10 space-y-6">
        <ClientRealtimePosts initialPosts={posts || []} topic={decodedTopic} />
      </section>
    </main>
  );
}
