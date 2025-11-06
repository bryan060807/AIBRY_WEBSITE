'use client';

import { useFormState } from 'react-dom';
import { updateProfile, updateEmail as updateAuth, updatePassword } from '@/actions/account-actions';

const initialState = { message: '', success: false };

export default function ProfileSettings() {
  const [profileState, profileAction] = useFormState(updateProfile, initialState);
  const [authState, authAction] = useFormState(updateAuth, initialState);
  const [passwordState, passwordAction] = useFormState(updatePassword, initialState);

  return (
    <div className="space-y-12">
      {/* --- Update Display Name --- */}
      <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-3">Display Name</h2>
        <form action={profileAction} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">New Display Name</label>
            <input
              name="display_name"
              type="text"
              placeholder="Enter new name..."
              className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#629aa9]"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <FormMessage state={profileState} />
            <button
              type="submit"
              className="rounded-md bg-[#629aa9] px-6 py-2 font-semibold text-white hover:bg-[#4f7f86] transition"
            >
              Update Name
            </button>
          </div>
        </form>
      </section>

      {/* --- Update Email --- */}
      <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-3">Account Email</h2>
        <form action={authAction} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">New Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter new email..."
              className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#629aa9]"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <FormMessage state={authState} />
            <button
              type="submit"
              className="rounded-md bg-[#629aa9] px-6 py-2 font-semibold text-white hover:bg-[#4f7f86] transition"
            >
              Update Email
            </button>
          </div>
        </form>
      </section>

      {/* --- Update Password --- */}
      <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-3">Change Password</h2>
        <form action={passwordAction} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">New Password</label>
            <input
              name="password"
              type="password"
              placeholder="Must be at least 6 characters"
              className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#629aa9]"
              required
              minLength={6}
            />
          </div>
          <div className="flex items-center justify-between">
            <FormMessage state={passwordState} />
            <button
              type="submit"
              className="rounded-md bg-[#629aa9] px-6 py-2 font-semibold text-white hover:bg-[#4f7f86] transition"
            >
              Update Password
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

/* --- Shared message component --- */
function FormMessage({ state }: { state: { message?: string; success?: boolean } }) {
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
