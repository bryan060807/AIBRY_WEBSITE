'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'react-hot-toast';

export default function ContactForm() {
  const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill out all fields.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });
      if (error) throw error;

      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-xl mx-auto mt-16 mb-24">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Contact AIBRY
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500 resize-none"
            placeholder="What’s on your mind?"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-[var(--color-accent)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--color-accent-hover)] disabled:opacity-50"
        >
          {loading ? 'Sending…' : 'Send Message'}
        </button>
      </form>
    </section>
  );
}