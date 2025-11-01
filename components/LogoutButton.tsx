'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { createBrowserClient } from '@supabase/ssr';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success('Logged out successfully.');
      router.refresh(); // refresh header state
      router.push('/login');
    } catch (err: any) {
      console.error('Logout failed:', err.message);
      toast.error('Logout failed. Please try again.');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-700 transition"
    >
      Logout
    </button>
  );
}