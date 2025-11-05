'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { createBrowserClient } from '@supabase/ssr';
import { useState } from 'react';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return; // prevent double click

    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success('Logged out successfully.');
      router.refresh(); // refresh UI state (nav, etc.)
      router.push('/login');
    } catch (err: any) {
      console.error('Logout failed:', err.message);
      toast.error('Logout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      aria-busy={loading}
      className={`rounded px-4 py-2 text-sm font-semibold transition
        ${
          loading
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-[#629aa9] text-white hover:bg-[#4f7f86]'
        }`}
    >
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  );
}
