// app/dashboard/page.tsx

import { createServerSideClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  FaTasks,
  FaDollarSign,
  FaComments,
  FaArrowRight,
} from "react-icons/fa";

// This component fetches the user's display name
async function UserWelcome() {
  const supabase = await createServerSideClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Fetch the display_name from the profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  const displayName = profile?.display_name || "User";

  return (
    <h1 className="text-4xl md:text-5xl font-bold text-white">
      Welcome, <span className="text-[#629aa9]">{displayName}</span>
    </h1>
  );
}

// A reusable card component for our links
function DashboardLink({
  href,
  title,
  description,
  icon: Icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-gray-800 bg-gray-900/50 p-6 transition-all duration-300 hover:border-[#629aa9] hover:bg-gray-800/60"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-[#629aa9] p-3 text-2xl text-white">
            <Icon />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-white">{title}</h3>
            <p className="text-gray-400">{description}</p>
          </div>
        </div>
        <FaArrowRight className="text-gray-600 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#629aa9]" />
      </div>
    </Link>
  );
}

// The main dashboard page
export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-20">
      <UserWelcome />
      <p className="mt-4 text-lg text-gray-300">
        This is your home base. Manage your tasks, track your goals, and connect
        with the community.
      </p>

      <div className="mt-12 space-y-6">
        <DashboardLink
          href="/todo"
          title="Daily ToDo"
          description="Manage your day-to-day routine tasks."
          icon={FaTasks}
        />
        <DashboardLink
          href="/monday-gpt"
          title="Monday 2.0"
          description="Track your weekly budget and goals."
          icon={FaDollarSign}
        />
        <DashboardLink
          href="/forum"
          title="Community Forum"
          description="Connect with other users."
          icon={FaComments}
        />
      </div>
    </div>
  );
}