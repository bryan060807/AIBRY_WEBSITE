'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { updateAuth, updatePassword } from './actions'; // adjust import if actions are elsewhere

type FormState = {
  message?: string;
  success?: boolean;
};

export default function DashboardForms({ userData }: { userData: any }) {
  const [message, setMessage] = useState<FormState>({});

  const [authState, authAction] = useFormState(updateAuth, { message: '', success: false });
  const [passState, passAction] = useFormState(updatePassword, { message: '', success: false });

  return (
    <section className="space-y-8">
      {/* --- FORM 2: Account Info --- */}
      <form
        action={authAction}
        className="card space-y-4 bg-gray-900 p-6 border border-gray-800 rounded-2xl"
        aria-labelledby="update-account-title"
      >
        <h2 id="update-account-title" className="text-xl font-semibold text-white">
          Account Info
        </h2>
        <p className="text-sm text-gray-400">This information is private.</p>

        <label className="block">
          <span className="text-sm font-medium text-gray-300">Email</span>
          <input
            type="email"
            name="email"
            defaultValue={userData.email}
            required
            className="w-full mt-1 rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500"
          />
        </label>

        <div className="flex items-center justify-between">
          <FormMessage state={authState} />
          <button type="submit" className="btn bg-[#629aa9] hover:bg-[#4f7f86]">
            Save Account
          </button>
        </div>
      </form>

      {/* --- FORM 3: Update Password --- */}
      <form
        action={passAction}
        className="card space-y-4 bg-gray-900 p-6 border border-gray-800 rounded-2xl"
        aria-labelledby="update-password-title"
      >
        <h2 id="update-password-title" className="text-xl font-semibold text-white">
          Update Password
        </h2>

        <label className="block">
          <span className="text-sm font-medium text-gray-300">New Password</span>
          <input
            type="password"
            name="password"
            placeholder="Must be at least 6 characters"
            minLength={6}
            required
            className="w-full mt-1 rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500"
          />
        </label>

        <div className="flex items-center justify-between">
          <FormMessage state={passState} />
          <button type="submit" className="btn bg-[#629aa9] hover:bg-[#4f7f86]">
            Update Password
          </button>
        </div>
      </form>
    </section>
  );
}

// --- Simple message component ---
function FormMessage({ state }: { state: FormState }) {
  if (!state.message) return null;
  return (
    <p
      role="status"
      className={`text-sm ${state.success ? 'text-green-500' : 'text-red-500'}`}
    >
      {state.message}
    </p>
  );
}