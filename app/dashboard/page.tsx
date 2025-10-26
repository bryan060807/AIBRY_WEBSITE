// app/dashboard/page.tsx
import { createServerSideClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import DashboardForms from './DashboardForms'; // We will create this next

async function getUserData(supabase: any, user: any) {
  // Get public profile data
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', user.id)
    .single();
  
  if (error) {
    console.error("Error fetching profile:", error.message);
  }

  return {
    email: user.email,
    phone: user.phone,
    display_name: profile?.display_name || '',
  };
}

export default async function DashboardPage() {
  const supabase = await createServerSideClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?message=You must be logged in to view this page.');
  }

  const userData = await getUserData(supabase, user);

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-8 text-4xl font-bold text-white">User Dashboard</h1>
      <p className="mb-2 text-lg text-gray-300">
        Welcome, <span className="font-bold text-white">{userData.display_name || userData.email}</span>.
      </p>
      <p className="mb-8 text-gray-400">
        Here you can update your public profile and private account details.
      </p>
      
      <DashboardForms userData={userData} />
    </main>
  );
}