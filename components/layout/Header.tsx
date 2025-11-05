'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserMenu } from '@/components/ui/UserMenu';

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
          <UserMenu />
        </div>
      </div>

      {/* Optional: Mobile nav toggle (future expansion) */}
      {/* You can later add a mobile menu here if needed */}
    </header>
  );
}
