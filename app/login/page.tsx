'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { supabase } from '@/utils/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [view, setView] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // Redirect if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        // Already logged in, redirect away from /login
        router.replace('/'); // change '/' to '/dashboard' if needed
      } else {
        setCheckingSession(false);
      }
    };

    checkSession();

    // Listen for sign-in or sign-out events
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) router.replace('/'); // Redirect on login
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [router]);

  if (checkingSession) {
    // Avoid flicker by showing nothing while checking auth
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-gray-400">
        <p>Checking session...</p>
      </main>
    );
  }

  // --- Login and Signup handlers ---
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Welcome back!');
      router.replace('/');
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const displayName = formData.get('display_name') as string;

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });

    if (error) toast.error(error.message);
    else toast.success('Check your email to confirm your account.');
    setLoading(false);
  };

  return (
    <main className="mx-auto max-w-md px-4 py-16 text-white">
      <div className="mb-6 flex border-b border-gray-700">
        <button
          onClick={() => setView('login')}
          className={`w-1/2 py-3 font-semibold ${
            view === 'login' ? 'border-b-2 border-[#629aa9]' : 'text-gray-500'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setView('signup')}
          className={`w-1/2 py-3 font-semibold ${
            view === 'signup' ? 'border-b-2 border-[#629aa9]' : 'text-gray-500'
          }`}
        >
          Sign Up
        </button>
      </div>

      {view === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your account.</p>

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-white"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-[#629aa9] py-3 font-semibold text-white hover:bg-[#4f7f86] transition"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

          <p className="text-center text-sm text-gray-400">
            Forgot your password?{' '}
            <a href="/login/reset" className="text-[#629aa9] hover:text-[#4f7f86]">
              Reset it
            </a>
          </p>
        </form>
      ) : (
        <form onSubmit={handleSignup} className="space-y-4">
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-gray-400">Join the community.</p>

          <input
            type="text"
            name="display_name"
            placeholder="Display Name"
            required
            className="w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-white"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-white"
          />
          <input
            type="password"
            name="password"
            placeholder="Password (min 6 chars)"
            minLength={6}
            required
            className="w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-[#629aa9] py-3 font-semibold text-white hover:bg-[#4f7f86] transition"
          >
            {loading ? 'Signing up…' : 'Sign Up'}
          </button>
        </form>
      )}
    </main>
  );
}
