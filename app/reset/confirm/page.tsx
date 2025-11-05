'use client';

import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function ResetConfirmPage() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim() || password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      console.error('Error updating password:', error);
      toast.error(error.message || 'Failed to update password.');
      return;
    }

    toast.success('Password updated successfully!');
    router.push('/login');
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-800 border border-gray-700 p-8 rounded-xl w-full max-w-sm text-center shadow-lg">
        <h1 className="text-2xl font-bold text-[#629aa9] mb-3">
          Set a New Password
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          Enter your new password below to complete the reset process.
        </p>

        <form onSubmit={handleNewPassword} className="space-y-4">
          <div>
            <label htmlFor="password" className="sr-only">
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              autoComplete="new-password"
              className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-[#629aa9] focus:border-[#629aa9] transition duration-200"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center bg-[#629aa9] text-white font-bold py-3 px-4 rounded-md hover:bg-[#4f7f86] disabled:bg-gray-700 disabled:text-gray-400 transition duration-200"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </main>
  );
}
