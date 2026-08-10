import Link from "next/link";
import { getCurrentServerUser } from "@/lib/server/auth";

const forumAdminRoles = new Set(["admin", "owner", "moderator"]);

export default async function DashboardPage() {
  const { user } = await getCurrentServerUser();
  const canModerateForum = forumAdminRoles.has(String(user?.role || "").toLowerCase());

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-sm uppercase tracking-[0.2em] text-[#629aa9]">Dashboard</p>
      <h1 className="mt-2 text-3xl font-semibold text-white">
        {user?.displayName || user?.email || "AIBRY account"}
      </h1>
      <p className="mt-3 max-w-2xl text-gray-400">
        Your account data is loaded from the Fedora website backend.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/profile"
          className="rounded-md bg-[#629aa9] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#7ab3c0] focus:outline-none focus:ring-2 focus:ring-[#629aa9]"
        >
          Edit profile
        </Link>
        <Link
          href="/forum"
          className="rounded-md border border-gray-700 px-4 py-2 text-sm font-semibold text-gray-100 transition hover:border-[#629aa9] hover:text-[#629aa9] focus:outline-none focus:ring-2 focus:ring-[#629aa9]"
        >
          Forum
        </Link>
        {canModerateForum ? (
          <Link
            href="/forum/admin"
            className="rounded-md border border-gray-700 px-4 py-2 text-sm font-semibold text-gray-100 transition hover:border-[#629aa9] hover:text-[#629aa9] focus:outline-none focus:ring-2 focus:ring-[#629aa9]"
          >
            Moderate forum
          </Link>
        ) : null}
      </div>
    </div>
  );
}
