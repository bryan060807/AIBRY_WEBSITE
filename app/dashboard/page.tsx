// app/dashboard/page.tsx
import { createServerSideClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import DashboardForms from './DashboardForms';
import UserActivity from './UserActivity'; // Import the new component

// --- NEW TYPES (exported for UserActivity to use) ---
export type UserPost = {
  id: number;
  title: string;
  created_at: string;
  topic: string;
}

export type UserComment = {
  id: number;
  content: string;
  created_at: string;
  posts: { // from inner join
    id: number;
    title: string;
    topic: string;
  };
}
// --- END NEW TYPES ---

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
    display_name: profile?.display_name || '',
  };
}

export default async function DashboardPage() {
  const supabase = await createServerSideClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?message=You must be logged in to view this page.');
  }

  // --- FETCH ALL DASHBOARD DATA IN PARALLEL ---
  const [userData, postsData, commentsData] = await Promise.all([
    getUserData(supabase, user),
    
    // Fetch user's posts
    supabase
      .from('posts')
      .select('id, title, created_at, topic')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
      
    // Fetch user's comments (and the post they belong to)
    supabase
      .from('comments')
      .select('id, content, created_at, posts!inner(id, title, topic)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
  ]);
  
  // Cast the data
  const userPosts: UserPost[] = (postsData.data as unknown as UserPost[]) || [];
  const userComments: UserComment[] = (commentsData.data as unknown as UserComment[]) || [];
  // --- END DATA FETCHING ---


  return (
    // Updated layout: wider and ready for columns
    <main className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-8 text-4xl font-bold text-white">User Dashboard</h1>
      <p className="mb-12 text-lg text-gray-300">
        Welcome, <span className="font-bold text-white">{userData.display_name || userData.email}</span>.
      </p>
      
      {/* New 2-Column Grid Layout */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        
        {/* Column 1: Settings Forms */}
        <div className="flex-1">
           <h2 className="text-2xl font-semibold text-white mb-6">Account Settings</h2>
           <p className="mb-6 text-gray-400">
             Update your public profile and private account details.
           </p>
           <DashboardForms userData={userData} />
        </div>
        
        {/* Column 2: Forum Activity */}
        <div className="flex-1">
           <h2 className="text-2xl font-semibold text-white mb-6">Your Forum Activity</h2>
           <UserActivity posts={userPosts} comments={userComments} />
        </div>

      </div>
    </main>
  );
}