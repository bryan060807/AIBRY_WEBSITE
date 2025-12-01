// /app/dashboard/page.tsx
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { DashboardAvatar } from "@/components/ui/DashboardAvatar";
import UserActivity from "./UserActivity";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return (
      <main className="mx-auto max-w-md py-24 text-center text-gray-300">
        <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
        <p>You must be signed in to view your dashboard.</p>
      </main>
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("display_name, email")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error fetching profile:", profileError);
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-gray-100 space-y-10">
      {/* Header */}
      <section>
        <h1 className="text-3xl font-bold text-white mb-3">
          Welcome back{profile?.display_name ? `, ${profile.display_name}` : ""}!
        </h1>
        <p className="text-gray-400">
          Here’s an overview of your recent activity.
        </p>
      </section>

      {/* Avatar + Info */}
      <section className="flex items-center gap-6">
        <DashboardAvatar />
        <div>
          <p className="text-lg text-white font-semibold">
            {profile?.display_name || "User"}
          </p>
          <p className="text-gray-400 text-sm">{profile?.email}</p>
        </div>
      </section>

      {/* Activity Feed */}
      <UserActivity posts={[]} comments={[]} />

      {/* Footer */}
      <div className="border-t border-gray-800 pt-6">
        <p className="text-gray-500 text-sm">
          To update your profile picture or account info, visit{" "}
          <a
            href="/profile/edit"
            className="text-[#629aa9] hover:underline"
          >
            your profile settings
          </a>
          .
        </p>
      </div>
    </main>
  );
}
