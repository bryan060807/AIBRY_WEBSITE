import { createServerSideClient } from '@/utils/supabase/server';
import { signUp, signIn } from '@/actions/auth-actions';
import { cookies } from 'next/headers';
import AuthMessages from '@/components/AuthMessages'; // Import the new component

export default async function LoginPage() {
  const supabase = await createServerSideClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Read URL parameters for error or success messages
  const cookieStore = cookies();
  const searchParams = new URLSearchParams(cookieStore.get('NEXT_URL')?.value.split('?')[1] || '');
  
  // We decode them here and pass them to the client component
  const errorMessage = searchParams.get('error') ? decodeURIComponent(searchParams.get('error')!) : null;
  const successMessage = searchParams.get('message') ? decodeURIComponent(searchParams.get('message')!) : null;


  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      {/* This component will now handle displaying the messages as toasts */}
      <AuthMessages error={errorMessage} message={successMessage} />

      {user ? (
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-8 shadow-lg">
          <h1 className="mb-4 text-2xl font-semibold text-white">Welcome!</h1>
          <p className="text-gray-400">You are already logged in and can access the community forum.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-8 shadow-lg">
          <h1 className="mb-4 text-2xl font-semibold text-white">Log in or Sign up</h1>
          <p className="mb-6 text-gray-400">Join the community to share your story and connect with others.</p>
          
          {/* The old <p> tags for messages have been removed from here 
            and replaced by the <AuthMessages /> component above.
          */}

          <form className="space-y-4">
            {/* NEW: Display Name Field for Sign Up */}
            <input
              type="text"
              name="display_name"
              placeholder="Display Name (for the Forum)"
              // This is NOT required for Sign In, but will be used by Sign Up
              className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500 focus:border-[#629aa9] focus:ring-1 focus:ring-[#629aa9]"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500 focus:border-[#629aa9] focus:ring-1 focus:ring-[#629aa9]"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500 focus:border-[#629aa9] focus:ring-1 focus:ring-[#629aa9]"
            />
            <button
              formAction={signIn}
              className="w-full rounded bg-[#629aa9] px-6 py-3 font-semibold text-white transition hover:bg-[#4f7f86]"
            >
              Sign In
            </button>
            <button
              formAction={signUp}
              className="w-full rounded bg-transparent border-2 border-[#629aa9] px-6 py-3 font-semibold text-[#629aa9] transition hover:bg-[#629aa9] hover:text-white"
            >
              Sign Up
            </button>
          </form>
        </div>
      )}
    </div>
  );
}