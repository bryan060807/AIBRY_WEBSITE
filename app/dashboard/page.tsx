// /app/dashboard/page.tsx
import { createSupabaseServerClient } from '@/utils/supabase/server';
import ProfileSettings from '@/components/forms/ProfileSettings';

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    // Optionally redirect to login if not authenticated
    return (
      <main className="mx-auto max-w-md py-24 text-center text-gray-300">
        <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
        <p>You must be signed in to view your dashboard.</p>
      </main>
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('display_name, email')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('Error fetching profile:', profileError);
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-gray-100">
      <h1 className="text-3xl font-bold text-white mb-8">
        Welcome back{profile?.display_name ? `, ${profile.display_name}` : ''}!
      </h1>

      <p className="text-gray-400 mb-10">
        Manage your profile, update your email, or change your password below.
      </p>

      <ProfileSettings userData={profile ?? {}} />
    </main>
  );
}
