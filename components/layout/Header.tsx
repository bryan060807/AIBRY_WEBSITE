"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import UserMenu from "@/components/ui/UserMenu";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading } = useAuth();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/apps", label: "Apps & Systems" },
    { href: "/store", label: "Store" },
    { href: "/discography", label: "Music" },
    { href: "/forum", label: "Forum" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) =>
    path === "/" ? pathname === path : pathname.startsWith(path);

  return (
    <header className="bg-black/70 backdrop-blur border-b border-gray-800 sticky top-0 z-50">
      <div className="mx-auto max-w-6xl flex justify-between items-center px-4 py-4">
        {/* Logo */}
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
            {user ? (
              <motion.div
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                <UserMenu />
              </motion.div>
            ) : !loading ? (
              <Link
                href="/login"
                className="text-gray-300 hover:text-[#629aa9] transition-colors"
              >
                Login
              </Link>
            ) : null}
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

      {/* Mobile Dropdown */}
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
                {user ? (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                  >
                    <UserMenu />
                  </motion.div>
                ) : !loading ? (
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-300 hover:text-[#629aa9] transition-colors"
                  >
                    Login
                  </Link>
                ) : null}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
