"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, LogOut, User, LayoutDashboard } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { useAvatar } from "@/context/AvatarContext";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function UserMenu({ session }: { session: any }) {
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState<string>("User");
  const { avatarUrl, refreshAvatar } = useAvatar();

  useEffect(() => {
    async function fetchProfile() {
      if (!session?.user) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", session.user.id)
        .single();

      if (!error && data) {
        setDisplayName(data.display_name || "User");
        if (data.avatar_url) refreshAvatar(session.user.id);
      }
    }
    fetchProfile();
  }, [session?.user, refreshAvatar]);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <div className="relative">
      {/* Dropdown Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 text-gray-300 hover:text-[#629aa9] transition"
      >
        <span className="hidden sm:inline text-sm font-medium">
          {displayName}
        </span>
        <ChevronDown size={16} />
      </button>

      {/* Dropdown Menu with Animation */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 rounded-lg bg-black border border-gray-800 shadow-lg py-2 z-50 overflow-hidden"
          >
            {/* Avatar + Info Card */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
              <div className="relative w-10 h-10">
                <Image
                  src={avatarUrl || "/images/default-avatar.png"}
                  alt="User avatar"
                  width={40}
                  height={40}
                  className="rounded-full border border-gray-700 object-cover"
                  priority
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-white truncate max-w-[10rem]">
                  {displayName}
                </p>
                <p className="text-xs text-gray-400 truncate max-w-[10rem]">
                  {session?.user?.email}
                </p>
              </div>
            </div>

            {/* Menu Links */}
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-[#629aa9] hover:bg-gray-900 transition"
              onClick={() => setOpen(false)}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>

            <Link
              href="/profile"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-[#629aa9] hover:bg-gray-900 transition"
              onClick={() => setOpen(false)}
            >
              <User size={16} />
              Profile
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:text-red-400 hover:bg-gray-900 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click-away Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
