'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'react-hot-toast';

export default function UpdatePasswordPage() {
  const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirm) {
      toast.error('Please fill out both fields.');
      return;
    }

    if (password !== confirm) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      toast.success('Password updated successfully!');
      setPassword('');
      setConfirm('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-gray-100 px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-gray-800 bg-gray-900/80 p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-center text-white">Update Password</h1>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500"
              placeholder="Confirm new password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-[var(--color-accent)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--color-accent-hover)] disabled:opacity-50"
          >
            {loading ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
    </main>
  );
}