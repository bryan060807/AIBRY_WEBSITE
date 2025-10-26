// components/Header.tsx
import Link from 'next/link';
import { createServerSideClient } from '@/utils/supabase/server';
import { logout } from '@/app/auth/actions';

export default async function Header() {
  const supabase = await createServerSideClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        
        {/* Left Side: Logo & Main Nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-bold text-white">
            AIBRY
          </Link>
          <div className="hidden items-center gap-4 md:flex">
            {/* MERCH LINK ADDED BACK */}
            <Link href="/merch" className="text-gray-300 transition hover:text-white">
              Merch
            </Link>
            <Link href="/forum" className="text-gray-300 transition hover:text-white">
              Forum
            </Link>
          </div>
        </div>

        {/* Right Side: Auth Links */}
        <div className="flex items-center gap-4">
          {user ? (
            // --- Logged IN View ---
            <>
              <Link href="/dashboard" className="text-sm text-gray-300 transition hover:text-white">
                Dashboard
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-600"
                >
                  Log Out
                </button>
              </form>
            </>
          ) : (
            // --- Logged OUT View ---
            <Link
              href="/login"
              className="rounded-md bg-[#629aa9] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4f7f86]"
            >
              Login / Sign Up
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}