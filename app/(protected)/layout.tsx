import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/ui/LogoutButton';
import { getCurrentServerUser } from '@/lib/server/auth';

/**
 * ProtectedLayout
 * 
 * Wraps routes that require authentication.
 * If the user has no active session, they are redirected to /login.
 */
export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const { user } = await getCurrentServerUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <section className="flex min-h-screen flex-col items-center bg-black text-gray-100 px-6 py-12">
      <div className="w-full max-w-4xl">
        {/* Header with user info + logout */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-[#629aa9]">
              Welcome, {user.displayName || user.email}
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
