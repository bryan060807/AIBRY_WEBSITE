"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/utils/supabase/client";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useAvatar } from "@/context/AvatarContext";
import UserMenu from "@/components/ui/UserMenu";

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const { avatarUrl, refreshAvatar } = useAvatar();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data?.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, sess) => {
      setSession(sess);
      if (sess?.user) refreshAvatar(sess.user.id);
    });
    return () => listener.subscription.unsubscribe();
  }, [refreshAvatar]);

  // Navigation
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/forum", label: "Forum" },
    { href: "/store", label: "Store" },
    { href: "/todo", label: "To-Do" },
    { href: "/merch", label: "Merch" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-black/70 backdrop-blur border-b border-gray-800 sticky top-0 z-50">
      <div className="mx-auto max-w-6xl flex justify-between items-center px-4 py-4">
        {/* Left: Logo */}
        <Link href="/" className="text-xl font-bold text-white tracking-wide">
          AIBRY
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${
                isActive(link.href)
                  ? "text-[#629aa9]"
                  : "text-gray-300 hover:text-[#629aa9]"
              } transition-colors`}
            >
              {link.label}
            </Link>
          ))}

          <div className="ml-4 flex items-center gap-3">
            {session ? (
              <>
                {/* Avatar with fade-in animation */}
                <motion.div
                  key={avatarUrl}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="relative w-9 h-9"
                >
                  <Image
                    src={avatarUrl || "/images/default-avatar.png"}
                    alt="User avatar"
                    width={36}
                    height={36}
                    className="rounded-full border border-gray-700 object-cover"
                    priority
                  />
                </motion.div>
                <UserMenu session={session} />
              </>
            ) : (
              <Link
                href="/login"
                className="text-gray-300 hover:text-[#629aa9] transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-300 hover:text-[#629aa9]"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-black/90 border-t border-gray-800"
          >
            <div className="flex flex-col px-6 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`${
                    isActive(link.href)
                      ? "text-[#629aa9]"
                      : "text-gray-300 hover:text-[#629aa9]"
                  } transition-colors`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-3 border-t border-gray-800 flex items-center gap-3">
                {session ? (
                  <>
                    <motion.div
                      key={avatarUrl}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25 }}
                      className="relative w-9 h-9"
                    >
                      <Image
                        src={avatarUrl || "/images/default-avatar.png"}
                        alt="User avatar"
                        width={36}
                        height={36}
                        className="rounded-full border border-gray-700 object-cover"
                        priority
                      />
                    </motion.div>
                    <UserMenu session={session} />
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-300 hover:text-[#629aa9] transition-colors"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
