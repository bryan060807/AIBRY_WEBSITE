// app/login/page.tsx
'use client';

import { useFormState } from 'react-dom';
import { login, signup } from '@/app/auth/actions';
import { useState } from 'react';

const loginInitialState = { message: '' };
const signupInitialState = { message: '' };

export default function LoginPage() {
  const [loginState, loginAction] = useFormState(login, loginInitialState);
  const [signupState, signupAction] = useFormState(signup, signupInitialState);
  
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <div className="mb-6 flex border-b border-gray-700">
        <button
          onClick={() => setIsLoginView(true)}
          className={`w-1/2 py-3 font-semibold ${
            isLoginView ? 'border-b-2 border-[#629aa9] text-white' : 'text-gray-500'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setIsLoginView(false)}
          className={`w-1/2 py-3 font-semibold ${
            !isLoginView ? 'border-b-2 border-[#629aa9] text-white' : 'text-gray-500'
          }`}
        >
          Sign Up
        </button>
      </div>

      {isLoginView ? (
        // --- LOGIN FORM ---
        <form action={loginAction} className="space-y-4">
          <h1 className="text-2xl font-bold text-white">Sign In</h1>
          <p className="text-gray-400">Welcome back. Sign in to post on the forum.</p>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500"
              required
            />
          </div>
          {loginState?.message && <p className="text-sm text-red-500">{loginState.message}</p>}
          <button
            type="submit"
            className="w-full rounded bg-[#629aa9] px-6 py-3 font-semibold text-white transition hover:bg-[#4f7f86]"
          >
            Sign In
          </button>
        </form>
      ) : (
        // --- SIGN UP FORM ---
        <form action={signupAction} className="space-y-4">
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-gray-400">Join the community to share your story.</p>
          
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Display Name (Username)</label>
            <input
              type="text"
              name="display_name"
              placeholder="This will be your public name"
              className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              minLength={6}
              placeholder="Must be at least 6 characters"
              className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500"
              required
            />
          </div>
          
          {/* REMOVED PHONE FIELD */}

          {signupState?.message && (
            <p className={`text-sm ${signupState.message.includes('Check your email') ? 'text-green-500' : 'text-red-500'}`}>
              {signupState.message}
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded bg-[#629aa9] px-6 py-3 font-semibold text-white transition hover:bg-[#4f7f86]"
          >
            Sign Up
          </button>
        </form>
      )}
    </main>
  );
}