'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/utils/supabase/client';

export default function NewPostPage() {
  const router = useRouter();
  const { topic } = useParams();
  const supabase = createSupabaseBrowserClient();  

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const user = userData?.user;
      if (!user) {
        setError('You must be signed in to create a post.');
        setLoading(false);
        return;
      }

      if (!title.trim() || !content.trim()) {
        setError('Title and content cannot be empty.');
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase.from('posts').insert([
        {
          topic,
          title: title.trim(),
          content: content.trim(),
          author: user.email || 'Anonymous',
          author_id: user.id,
        },
      ]);

      if (insertError) throw insertError;

      // Redirect to the topic page and trigger ISR refresh
      router.push(`/forum/${topic}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong while creating the post.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-6 text-3xl font-bold text-[#629aa9] capitalize">
        New Post in {decodeURIComponent(topic as string)}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-white placeholder-gray-500"
            placeholder="Enter a clear, descriptive title"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[200px] rounded-md border border-gray-700 bg-gray-900 p-3 text-white placeholder-gray-500"
            placeholder="Write your thoughts here..."
            required
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-[#629aa9] px-6 py-3 font-semibold text-white transition hover:bg-[#4f7f86] disabled:opacity-50"
        >
          {loading ? 'Posting…' : 'Create Post'}
        </button>
      </form>
    </main>
  );
}
