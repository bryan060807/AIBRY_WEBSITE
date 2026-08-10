"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function LogoutButton() {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <button
      type="button"
      onClick={async () => {
        await logout();
        router.push("/");
        router.refresh();
      }}
      className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-700 px-4 py-2 text-sm font-medium text-gray-100 transition hover:border-[#629aa9] hover:text-[#629aa9] focus:outline-none focus:ring-2 focus:ring-[#629aa9]"
    >
      <LogOut className="h-4 w-4" />
      Log out
    </button>
  );
}
