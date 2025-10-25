// components/Header.tsx

import Link from 'next/link';
import Image from 'next/image';
import { createServerSideClient } from '../utils/supabase/server';
import { signOut } from '@/actions/auth-actions';

export default async function Header() {
  const supabase = await createServerSideClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 bg-black bg-opacity-80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4">
        {/* Logo and Home Link */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="AIBRY Logo"
            width={50}
            height={50}
            priority
          />
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="text-white hover:text-[#629aa9] transition"
          >
            Home
          </Link>

          {/* NEW: To-Do App Link - Styled with a clear identifier */}
          <Link
            href="/todo"
            className="font-bold text-[#e03b8b] hover:text-white transition tracking-wider" // Uses the pink accent color from the To-Do app
          >
            /ROUTINE
          </Link>

          {/* NEW MONDAY 2.0 LINK */}
          <Link
            href="/monday-gpt"
            className="text-white hover:text-[#629aa9] transition"
          >
            Monday 2.0
          </Link>

          <Link
            href="/forum"
            className="text-white hover:text-[#629aa9] transition"
          >
            Community Forum
          </Link>

          <a
            href="https://aibry.bandcamp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#629aa9] transition"
          >
            Music
          </a>

          {user ? (
            // Display Sign Out button if user is logged in
            <form action={signOut}>
              <button
                type="submit"
                className="rounded bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
              >
                Sign Out
              </button>
            </form>
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