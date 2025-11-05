'use client';

import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function PasswordReset() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email address.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset/confirm`,
    });

    setLoading(false);

    if (error) {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Failed to send reset email.');
      return;
    }

    toast.success('Check your inbox for a password reset link.');
    router.push('/login');
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-title"
    >
      <div className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-sm m-4 relative border border-gray-700">
        <button
          onClick={() => router.back()}
          className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
          aria-label="Close reset form"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <h2 id="reset-title" className="text-2xl font-bold text-[#629aa9]">
            Reset Password
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Enter your account email to receive a password reset link.
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="email"
              className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-[#629aa9] focus:border-[#629aa9] transition duration-200"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center bg-[#629aa9] text-white font-bold py-3 px-4 rounded-md hover:bg-[#4f7f86] disabled:bg-gray-700 disabled:text-gray-400 transition duration-200"
          >
            {loading ? 'Sending link...' : 'Send Reset Link'}
          </button>

          <p className="text-sm text-gray-400 text-center mt-2">
            Remembered your password?{' '}
            <a href="/login" className="text-[#629aa9] hover:text-[#4f7f86]">
              Back to Sign In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
