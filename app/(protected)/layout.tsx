import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import LogoutButton from '@/components/ui/LogoutButton';

/**
 * ProtectedLayout
 * 
 * Wraps routes that require authentication.
 * If the user has no active session, they are redirected to /login.
 */
export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  // Create server-side Supabase client
  const supabase = createSupabaseServerClient();

  // Retrieve session data
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect unauthenticated visitors
  if (!session) {
    redirect('/login');
  }

  const user = session.user;

  return (
    <section className="flex min-h-screen flex-col items-center bg-black text-gray-100 px-6 py-12">
      <div className="w-full max-w-4xl">
        {/* Header with user info + logout */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-[#629aa9]">
              Welcome, {user.user_metadata?.display_name || user.email}
            </h1>
            <p className="text-gray-400 mt-1 text-sm">
              Signed in as {user.email}
            </p>
          </div>

          <LogoutButton />
        </header>

        {/* Main protected content */}
        <main className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6 shadow-xl backdrop-blur-md">
          {children}
        </main>
      </div>
    </section>
  );
}
