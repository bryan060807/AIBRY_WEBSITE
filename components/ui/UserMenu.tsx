"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAvatar } from "@/context/AvatarContext";
import { supabase } from "@/utils/supabase/client";
import { AvatarBase } from "@/components/ui/AvatarBase";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { avatarUrl, refreshAvatar } = useAvatar();

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUser(user);
    }
    loadUser();
    refreshAvatar();
  }, [refreshAvatar]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 focus:outline-none"
      >
        <AvatarBase src={avatarUrl} size={40} />
        <span className="hidden sm:inline text-gray-300 text-sm font-medium">
          {user?.email || "Account"}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-[#111] border border-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
          <Link
            href="/dashboard"
            className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#1c1c1c] transition"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#1c1c1c] transition"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>
          <Link
            href="/profile/edit"
            className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#1c1c1c] transition"
            onClick={() => setOpen(false)}
          >
            Edit Profile
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#1c1c1c] transition"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
