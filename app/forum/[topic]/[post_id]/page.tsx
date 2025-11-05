import { createSupabaseServerClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { topic: string; post_id: string };
}): Promise<Metadata> {
  const supabase = createSupabaseServerClient();
  const { data: post } = await supabase
    .from('posts')
    .select('title, topic')
    .eq('id', params.post_id)
    .single();

  return {
    title: post?.title ? `${post.title} | AIBRY Forum` : 'Post | AIBRY Forum',
  };
}

export default async function PostPage({
  params,
}: {
  params: { topic: string; post_id: string };
}) {
  const supabase = createSupabaseServerClient(); // ✅ fixed
  const { post_id } = params;

  const { data: post, error: postError } = await supabase
    .from('posts')
    .select('*')
    .eq('id', post_id)
    .single();

  if (!post || postError) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-gray-100">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-400 mb-8">{post.content}</p>
      <p className="text-sm text-gray-500">Posted by {post.author}</p>
    </main>
  );
}
