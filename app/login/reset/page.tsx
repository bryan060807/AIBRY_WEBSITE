'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '@/utils/supabase/client';

/**
 * ResetPasswordPage — sends a password reset email using Supabase.
 */
export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email.');
      return;
    }

    setLoading(true);
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/login/update`,
      });

      if (error) throw error;

      toast.success('Password reset email sent! Check your inbox.');
      setEmail('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-gray-100 px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-gray-800 bg-gray-900/80 p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-center text-white">Reset Password</h1>
        <p className="text-sm text-center text-gray-400 mb-6">
          Enter your email to receive a password reset link.
        </p>

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#629aa9]"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded px-6 py-3 font-semibold text-white transition ${
              loading
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-[#629aa9] hover:bg-[#4f7f86]'
            }`}
          >
            {loading ? 'Sending…' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </main>
  );
}
