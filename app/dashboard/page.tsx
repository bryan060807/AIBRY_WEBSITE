import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';

// Metadata for SEO
export const metadata = {
  title: 'Dashboard',
  description: 'Manage your profile, activity, and community settings.',
};

export default async function DashboardPage() {
  // Explicitly configure cookie handlers (modern @supabase/ssr requirement)
  const cookieStore = cookies();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          cookieStore.set({ name, value, ...options });
        },
        remove: (name: string, options: any) => {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Get the logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect if not logged in
  if (!user) {
    redirect('/login');
  }

  // Fetch profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error loading profile:', error.message);
  }

  return (
    <main className="max-w-4xl mx-auto mt-16 px-6 text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>

      {/* --- PROFILE CARD --- */}
      <section className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-md mb-8">
        {profile?.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt="User Avatar"
            width={100}
            height={100}
            className="rounded-full border border-gray-700 shadow-md object-cover"
          />
        ) : (
          <div className="w-[100px] h-[100px] rounded-full border border-gray-700 flex items-center justify-center text-gray-500">
            No Avatar
          </div>
        )}

        <div className="flex flex-col flex-1">
          <h2 className="text-2xl font-semibold text-white">
            {profile?.full_name || user.email}
          </h2>
          {profile?.username && (
            <p className="text-gray-400">@{profile.username}</p>
          )}
          {profile?.bio && (
            <p className="mt-3 text-gray-300 text-sm">{profile.bio}</p>
          )}
        </div>

        <Link
          href="/profile"
          className="btn bg-[#629aa9] hover:bg-[#4f7f86] text-white font-semibold text-sm px-4 py-2"
        >
          Edit Profile
        </Link>
      </section>

      {/* --- DASHBOARD LINKS --- */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {dashboardLinks.map(({ href, icon, title, description }) => (
          <Link
            key={href}
            href={href}
            className="block rounded-2xl bg-gray-900 border border-gray-800 p-6 transition hover:border-[#629aa9] hover:shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-1">
              {icon} {title}
            </h3>
            <p className="text-gray-400 text-sm">{description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}

const dashboardLinks = [
  {
    href: '/store',
    icon: '🎧',
    title: 'Music Store',
    description: 'Access exclusive tracks and releases.',
  },
  {
    href: '/todo',
    icon: '📝',
    title: 'To-Do',
    description: 'Manage your creative workflow and tasks.',
  },
  {
    href: '/forum',
    icon: '💬',
    title: 'Forum',
    description: 'Join discussions with the AIBRY community.',
  },
  {
    href: '/testimonials',
    icon: '⭐',
    title: 'Testimonials',
    description: 'Read or submit fan feedback.',
  },
];