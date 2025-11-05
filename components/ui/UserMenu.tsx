'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User, LayoutDashboard, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/utils/supabase/client';

interface UserMenuProps {
  user?: {
    id?: string;
    email?: string;
    user_metadata?: { name?: string };
  };
  mobile?: boolean;
  onClose?: () => void;
}

export default function UserMenu({ user, mobile = false, onClose }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<typeof user | null>(user || null);

  // Fetch the user if not passed from parent
  useEffect(() => {
    if (!currentUser) {
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) setCurrentUser(data.user);
      });
    }
  }, [currentUser]);

  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    onClose?.();
    router.push('/login');
  };

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Render login button if no user
  if (!currentUser) {
    return (
      <Link
        href="/login"
        onClick={onClose}
        className="rounded-md bg-[#629aa9] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4f7f86] transition"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div
      ref={menuRef}
      className={`relative ${mobile ? 'w-full' : 'inline-block text-left'}`}
    >
      {/* Menu button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center justify-between gap-2 rounded-md bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 transition w-full ${
          mobile ? 'text-left' : ''
        }`}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span>{currentUser.email ?? 'Account'}</span>
        <ChevronDown
          size={16}
          className={`${open ? 'rotate-180' : ''} transition-transform`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className={`absolute right-0 mt-2 w-48 origin-top-right rounded-md border border-gray-700 bg-black/95 shadow-lg backdrop-blur-sm z-50 ${
              mobile ? 'static mt-2 w-full' : ''
            }`}
          >
            <Link
              href="/profile"
              onClick={() => {
                setOpen(false);
                onClose?.();
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#629aa9] transition"
            >
              <User size={16} /> Profile
            </Link>

            <Link
              href="/dashboard"
              onClick={() => {
                setOpen(false);
                onClose?.();
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#629aa9] transition"
            >
              <LayoutDashboard size={16} /> Dashboard
            </Link>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-red-400 transition"
            >
              <LogOut size={16} /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
