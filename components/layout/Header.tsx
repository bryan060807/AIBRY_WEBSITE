'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fetch session and subscribe to changes
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);
      setLoading(false);
    };

    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener?.subscription?.unsubscribe();
  }, []);

  const toggleMobile = () => setMobileOpen((prev) => !prev);
  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-wide text-[#629aa9] hover:text-[#83c0cc] transition-colors"
        >
          AIBRY
        </Link>

        {/* Desktop Nav */}
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

        {/* User menu (desktop) */}
        <div className="hidden lg:flex items-center gap-3">
          {!loading && <UserMenu user={user} />}
        </div>

        {/* Hamburger button (mobile only) */}
        <button
          onClick={toggleMobile}
          className="lg:hidden rounded-md p-2 text-gray-300 hover:text-white hover:bg-gray-800 transition"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Animated Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="lg:hidden border-t border-gray-800 bg-black/90 backdrop-blur-sm shadow-lg"
          >
            <nav className="flex flex-col px-4 py-3 space-y-2 text-gray-300">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobile}
                  className={`rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-800 hover:text-[#629aa9] transition ${
                    pathname === link.href ? 'text-[#629aa9] bg-gray-900' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="border-t border-gray-700 pt-3"
              >
                {!loading && <UserMenu user={user} mobile onClose={closeMobile} />}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
