'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';

export default function TestimonialForm() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [user, setUser] = useState<any>(null);

  // Fetch logged-in user once on mount
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in to submit a testimonial.');
      return;
    }

    if (!content.trim()) {
      toast.error('Testimonial cannot be empty.');
      return;
    }

    try {
      const { error } = await supabase.from('testimonials').insert([
        {
          content: content.trim(),
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      toast.success('Thanks for your testimonial!');
      setContent('');
      router.refresh();
    } catch (error: any) {
      console.error('Error submitting testimonial:', error.message);
      toast.error('Failed to submit testimonial.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-gray-900 border border-gray-800 rounded-2xl space-y-4"
    >
      <h2 className="text-xl font-semibold text-white">Share Your Thoughts</h2>
      <p className="text-sm text-gray-400">Tell us about your experience with AIBRY.</p>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your testimonial..."
        className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#629aa9] resize-none h-32"
      />

      <button
        type="submit"
        disabled={!content.trim()}
        className="w-full bg-[#629aa9] hover:bg-[#4f7f86] text-white font-semibold py-2 rounded-md transition disabled:opacity-50"
      >
        Submit
      </button>
    </form>
  );
}
