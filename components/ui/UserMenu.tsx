"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { supabase } from "@/utils/supabase/client";

export default function UserMenu({ session }: { session: any }) {
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 text-gray-300 hover:text-[#629aa9] transition"
      >
        {session?.user?.email}
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-md bg-black border border-gray-800 shadow-lg py-2 z-50">
          <Link
            href="/dashboard"
            className="block px-4 py-2 text-gray-300 hover:text-[#629aa9] transition"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/profile"
            className="block px-4 py-2 text-gray-300 hover:text-[#629aa9] transition"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-red-500 hover:text-red-400 transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
