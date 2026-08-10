"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, UserRound } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function UserMenu() {
  const router = useRouter();
  const { user, logout } = useAuth();

  if (!user) return null;

  const initials = getInitials(user.displayName || user.email || user.username || "AIBRY");

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/profile"
        className="group flex items-center gap-2 rounded-md border border-gray-800 bg-gray-950/70 px-2 py-1.5 text-sm text-gray-200 transition hover:border-[#629aa9] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#629aa9]"
      >
        <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-[#1f3b43] text-xs font-semibold text-white">
          {user.avatarUrl && user.avatarUrl !== "/images/default-avatar.png" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt=""
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            initials
          )}
        </span>
        <span className="hidden max-w-28 truncate sm:inline">
          {user.displayName || user.username || "Profile"}
        </span>
        <UserRound className="h-4 w-4 text-gray-400 transition group-hover:text-[#629aa9]" />
      </Link>
      <button
        type="button"
        onClick={async () => {
          await logout();
          router.push("/");
          router.refresh();
        }}
        className="rounded-md p-2 text-gray-300 transition hover:bg-gray-900 hover:text-[#629aa9] focus:outline-none focus:ring-2 focus:ring-[#629aa9]"
        aria-label="Log out"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </div>
  );
}

function getInitials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
