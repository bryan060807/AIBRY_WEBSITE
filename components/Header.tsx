'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';
import LogoutButton from '@/components/LogoutButton';

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Detect scroll for dynamic header style
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync user session with Supabase
  useEffect(() => {
    let mounted = true;

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (mounted) setUser(user);
    };

    getUser();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [supabase]);

  const navItems = [
    { href: '/store', label: 'Store' },
    { href: '/merch', label: 'Merch' },
    { href: '/archive', label: 'AI Archive' },
    { href: '/forum', label: 'Forum' },
    { href: '/monday-gpt', label: 'Monday-GPT' },
    { href: '/todo', label: 'To-Do' },
    { href: '/dashboard', label: 'Dashboard' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/85 backdrop-blur-md border-b border-gray-800 shadow-lg shadow-black/20'
          : 'bg-black/60 backdrop-blur border-b border-gray-800'
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-4 ${
          scrolled ? 'py-3' : 'py-5'
        } transition-all duration-300`}
      >
        {/* Logo */}
        <Link
          href="/"
          className={`text-white font-bold transition-all ${
            scrolled ? 'text-xl' : 'text-2xl'
          } hover:text-[#629aa9]`}
        >
          AIBRY
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`relative hover:text-[#629aa9] transition ${
                pathname === href
                  ? 'text-[#629aa9] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-[#629aa9] after:content-[""]'
                  : 'text-gray-300'
              }`}
            >
              {label}
            </Link>
          ))}

          {user ? (
            <LogoutButton />
          ) : (
            <Link
              href="/login"
              className={`relative hover:text-[#629aa9] transition ${
                pathname === '/login' ? 'text-[#629aa9]' : 'text-gray-300'
              }`}
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden text-gray-300 hover:text-[#629aa9] transition"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-black/95 border-t border-gray-800 px-4 pb-4"
          >
            <ul className="flex flex-col space-y-3 mt-2 text-sm font-medium">
              {navItems.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={`block py-2 transition ${
                      pathname === href
                        ? 'text-[#629aa9]'
                        : 'text-gray-300 hover:text-[#629aa9]'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}

              <li className="pt-2 border-t border-gray-800">
                {user ? (
                  <LogoutButton />
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className={`block py-2 transition ${
                      pathname === '/login'
                        ? 'text-[#629aa9]'
                        : 'text-gray-300 hover:text-[#629aa9]'
                    }`}
                  >
                    Login
                  </Link>
                )}
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}