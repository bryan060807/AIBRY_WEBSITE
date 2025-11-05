'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UserMenu from '@/components/ui/UserMenu';
import { supabase } from '@/utils/supabase/client';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/forum', label: 'Forum' },
  { href: '/store', label: 'Store' },
  { href: '/merch', label: 'Merch' },
  { href: '/todo', label: 'To-Do' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/newsletter', label: 'Newsletter' },
  { href: '/contact', label: 'Contact' },
  { href: '/about', label: 'About' },
];

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  // Fetch user on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));

    // Optional: subscribe to auth state changes
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="text-xl font-bold tracking-wide text-[#629aa9] hover:text-[#83c0cc] transition-colors"
        >
          AIBRY
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-gray-300">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-[#629aa9] ${
                pathname === link.href ? 'text-[#629aa9]' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* User Menu */}
        <div className="flex items-center gap-3">
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}
