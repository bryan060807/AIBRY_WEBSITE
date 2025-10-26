// app/dashboard/DashboardForms.tsx
'use client';

import { useFormState } from 'react-dom';
import { updateProfile, updateAuth, updatePassword } from './actions';
import { useEffect, useState } from 'react';

const initialState = { message: '', success: false };

export default function DashboardForms({ userData }: { userData: any }) {
  const [profileState, profileAction] = useFormState(updateProfile, initialState);
  const [authState, authAction] = useFormState(updateAuth, initialState);
  const [passState, passAction] = useFormState(updatePassword, initialState);

  const [profileMessage, setProfileMessage] = useState(initialState);
  const [authMessage, setAuthMessage] = useState(initialState);
  const [passMessage, setPassMessage] = useState(initialState);

  // Use useEffect to show success messages briefly
  useEffect(() => {
    setProfileMessage(profileState);
    if (profileState.success) {
      setTimeout(() => setProfileMessage(initialState), 3000);
    }
  }, [profileState]);
  
  useEffect(() => {
    setAuthMessage(authState);
    if (authState.success) {
      setTimeout(() => setAuthMessage(initialState), 3000);
    }
  }, [authState]);
  
  useEffect(() => {
    setPassMessage(passState);
    if (passState.success) {
      setTimeout(() => setPassMessage(initialState), 3000);
    }
  }, [passState]);


  return (
    <div className="space-y-10">
      
      {/* --- FORM 1: Update Profile --- */}
      <form action={profileAction} className="space-y-4 rounded-lg border border-gray-800 bg-gray-900 p-6">
        <h2 className="text-xl font-semibold text-white">Public Profile</h2>
        <p className="text-sm text-gray-400">This information is visible on your forum posts.</p>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">Display Name (Username)</label>
          <input
            type="text"
            name="display_name"
            defaultValue={userData.display_name}
            className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white"
          />
        </div>
        <div className="flex items-center justify-between">
          <Message state={profileMessage} />
          <button type="submit" className="rounded bg-[#629aa9] px-5 py-2.5 font-semibold text-white transition hover:bg-[#4f7f86]">
            Save Profile
          </button>
        </div>
      </form>

      {/* --- FORM 2: Update Account Info --- */}
      <form action={authAction} className="space-y-4 rounded-lg border border-gray-800 bg-gray-900 p-6">
        <h2 className="text-xl font-semibold text-white">Account Info</h2>
        <p className="text-sm text-gray-400">This information is private.</p>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">Email</label>
          <input
            type="email"
            name="email"
            defaultValue={userData.email}
            className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">Phone</label>
          <input
            type="tel"
            name="phone"
            defaultValue={userData.phone || ''}
            className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white"
          />
        </div>
        <div className="flex items-center justify-between">
          <Message state={authMessage} />
          <button type="submit" className="rounded bg-[#629aa9] px-5 py-2.5 font-semibold text-white transition hover:bg-[#4f7f86]">
            Save Account
          </button>
        </div>
      </form>

      {/* --- FORM 3: Update Password --- */}
      <form action={passAction} className="space-y-4 rounded-lg border border-gray-800 bg-gray-900 p-6">
        <h2 className="text-xl font-semibold text-white">Update Password</h2>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-300">New Password</label>
          <input
            type="password"
            name="password"
            placeholder="Must be at least 6 characters"
            className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <Message state={passMessage} />
          <button type="submit" className="rounded bg-[#629aa9] px-5 py-2.5 font-semibold text-white transition hover:bg-[#4f7f86]">
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}

// Simple component to display form messages
function Message({ state }: { state: { message: string; success: boolean } }) {
  if (!state.message) return null;
  return (
    <p className={`text-sm ${state.success ? 'text-green-500' : 'text-red-500'}`}>
      {state.message}
    </p>
  );
}