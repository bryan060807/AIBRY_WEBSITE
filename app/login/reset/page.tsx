'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';

export default function PasswordResetPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return toast.error('Enter your email.');

    setLoading(true);
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/login/update`,
      });

      if (error) throw error;
      toast.success('Check your inbox for the reset link.');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-700 bg-gray-800 p-8 shadow-2xl">
        <h2 className="mb-2 text-2xl font-bold text-[#629aa9]">Reset Password</h2>
        <p className="mb-6 text-sm text-gray-400">
          Enter your account email to receive a reset link.
        </p>

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded py-3 font-semibold transition ${
              loading
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-[#629aa9] hover:bg-[#4f7f86]'
            }`}
          >
            {loading ? 'Sending link…' : 'Send Reset Link'}
          </button>
        </form>

        <p className="mt-3 text-center text-sm text-gray-400">
          Remember your password?{' '}
          <a href="/login" className="text-[#629aa9] hover:text-[#4f7f86]">
            Back to Sign In
          </a>
        </p>
      </div>
    </main>
  );
}
