'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { login, signup } from './actions';

const loginInitial = { message: '' };
const signupInitial = { message: '' };

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginState, loginAction] = useFormState(login, loginInitial);
  const [signupState, signupAction] = useFormState(signup, signupInitial);

  return (
    <main className="mx-auto max-w-md px-4 py-16 text-gray-200">
      <div className="mb-6 flex border-b border-gray-700">
        <button
          onClick={() => setIsLogin(true)}
          className={`w-1/2 py-3 font-semibold ${
            isLogin ? 'border-b-2 border-[#629aa9] text-white' : 'text-gray-500'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`w-1/2 py-3 font-semibold ${
            !isLogin ? 'border-b-2 border-[#629aa9] text-white' : 'text-gray-500'
          }`}
        >
          Sign Up
        </button>
      </div>

      {isLogin ? (
        <form action={loginAction} className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input
              name="email"
              type="email"
              className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input
              name="password"
              type="password"
              className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white"
              required
            />
          </div>
          {loginState?.message && <p className="text-sm text-red-500">{loginState.message}</p>}
          <button
            type="submit"
            className="w-full rounded bg-[#629aa9] py-3 font-semibold hover:bg-[#4f7f86] transition"
          >
            Sign In
          </button>
        </form>
      ) : (
        <form action={signupAction} className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Create Account</h2>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Display Name</label>
            <input
              name="display_name"
              type="text"
              className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input
              name="email"
              type="email"
              className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input
              name="password"
              type="password"
              className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white"
              required
              minLength={6}
            />
          </div>
          {signupState?.message && (
            <p className="text-sm text-red-500">{signupState.message}</p>
          )}
          <button
            type="submit"
            className="w-full rounded bg-[#629aa9] py-3 font-semibold hover:bg-[#4f7f86] transition"
          >
            Sign Up
          </button>
        </form>
      )}
    </main>
  );
}
