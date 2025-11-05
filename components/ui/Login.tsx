'use client';

import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function Login() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error('Please enter your email and password.');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to sign in.');
      return;
    }

    // success 🎉
    toast.success('Welcome back!');
    router.refresh(); // revalidate session
    router.push('/dashboard'); // or wherever you want to land after login
  };

  const handleReset = () => {
    window.location.href = '/login/reset';
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
    >
      <div className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-sm m-4 relative border border-gray-700 transform transition-transform duration-200 scale-100 hover:scale-[1.02]">
        {/* Close button */}
        <button
          onClick={() => router.back()}
          className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
          aria-label="Close login form"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 id="login-title" className="text-2xl font-bold text-[#629aa9]">
            Sign In
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Enter your credentials to access your account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="email"
              className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-[#629aa9] focus:border-[#629aa9] transition duration-200"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-[#629aa9] focus:border-[#629aa9] transition duration-200"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center bg-[#629aa9] text-white font-bold py-3 px-4 rounded-md hover:bg-[#4f7f86] disabled:bg-gray-700 disabled:text-gray-400 transition duration-200"
          >
            {loading ? 'Signing in...' : 'Continue'}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="text-sm text-[#629aa9] hover:text-[#4f7f86] w-full text-center mt-2"
          >
            Forgot your password?
          </button>
        </form>
      </div>
    </div>
  );
}
