'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';

/**
 * LogoutButton — safely signs the user out and redirects to /login.
 */
export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return; // prevent double-clicks
    setLoading(true);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success('Logged out successfully.');
      router.refresh(); // ensures server components re-fetch with no session
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
      className={`rounded px-4 py-2 text-sm font-semibold transition ${
        loading
          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
          : 'bg-[#629aa9] text-white hover:bg-[#4f7f86]'
      }`}
    >
      {loading ? 'Logging out…' : 'Logout'}
    </button>
  );
}
