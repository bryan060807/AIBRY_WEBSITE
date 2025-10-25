// components/Header.tsx

import Link from 'next/link';
import Image from 'next/image';
import { createServerSideClient } from '../utils/supabase/server';
import { signOut } from '@/actions/auth-actions';

export default async function Header() {
  const supabase = await createServerSideClient();
  const { data: { user } } = await supabase.auth.getUser();

  let displayName: string | null = null;

  // If the user is logged in, fetch their profile name
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single();
    
    // Use their display name, or fall back to their email if no profile
    displayName = profile?.display_name || user.email || "User";
  }

  return (
    <header className="sticky top-0 z-50 bg-black bg-opacity-80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4">
        {/* Logo and Home Link */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="AIBRY Logo"
            width={50}
    _blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#629aa9] transition"
          >
            Music
          </a>

          {user ? (
            // --- UPDATED: User Logged-In Section ---
s           <div className="flex items-center space-x-4">
              {/* 1. Display User's Name */}
              <span className="text-sm font-medium text-gray-300">
                {displayName}
              </span>

              {/* 2. Link to Dashboard */}
              <Link
                href="/dashboard"
                className="rounded bg-[#629aa9] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4f7f86]"
              >
                Dashboard
              </Link>

              {/* 3. Sign Out Button */}
              <form action={signOut} className="flex">
                <button
                  type="submit"
                  className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
content="                >
                  Sign Out
                </button>
              </form>
            </div>
          ) : (
            // Display Login button if user is not logged in
            <Link
              href="/login"
              className="rounded bg-[#629aa9] px-4 py-2 font-semibold text-white transition hover:bg-[#4f7f86]"
            >
              Log In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}