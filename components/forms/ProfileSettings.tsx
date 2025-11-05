'use client';

import { useFormState } from 'react-dom';
import { useState } from 'react';
import {
  updateProfile,
  updateEmail,
  updatePassword,
} from '@/actions/account-actions';

type FormState = {
  message?: string;
  success?: boolean;
};

const tabs = ['profile', 'email', 'password'] as const;
const buttonClasses =
  'w-full bg-[#629aa9] hover:bg-[#4f7f86] text-white rounded-md py-2 font-semibold transition disabled:opacity-50';

export default function ProfileSettings({
  userData,
}: {
  userData: { display_name?: string; email?: string };
}) {
  const [activeForm, setActiveForm] = useState<typeof tabs[number]>('profile');
  const [loading, setLoading] = useState(false);

  const [profileState, profileAction] = useFormState(updateProfile, {
    message: '',
    success: false,
  });
  const [emailState, emailAction] = useFormState(updateEmail, {
    message: '',
    success: false,
  });
  const [passwordState, passwordAction] = useFormState(updatePassword, {
    message: '',
    success: false,
  });

  const handleSubmit = async (action: any, formData: FormData) => {
    setLoading(true);
    await action(formData);
    setLoading(false);
  };

  return (
    <section className="space-y-8">
      <h1 className="text-2xl font-bold text-white mb-4">Account Settings</h1>

      {/* Tab selector */}
      <div className="flex space-x-4 border-b border-gray-800 pb-2 text-gray-400">
        {tabs.map((key) => (
          <button
            key={key}
            onClick={() => setActiveForm(key)}
            className={`capitalize pb-1 ${
              activeForm === key
                ? 'border-b-2 border-[#629aa9] text-white'
                : 'hover:text-gray-200'
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {/* PROFILE FORM */}
      {activeForm === 'profile' && (
        <form
          action={(fd) => handleSubmit(profileAction, fd)}
          className="rounded-2xl bg-gray-900 border border-gray-800 p-6 space-y-4 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-white">Display Name</h2>
          <p className="text-sm text-gray-400 mb-3">
            This will appear on your public profile.
          </p>

          <label className="block text-sm text-gray-300">
            New Display Name
            <input
              type="text"
              name="display_name"
              defaultValue={userData.display_name ?? ''}
              className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500 focus:border-[#629aa9] focus:ring-1 focus:ring-[#629aa9]"
              required
            />
          </label>

          <FormMessage state={profileState} />
          <button type="submit" className={buttonClasses} disabled={loading}>
            {loading ? 'Updating…' : 'Update Profile'}
          </button>
        </form>
      )}

      {/* EMAIL FORM */}
      {activeForm === 'email' && (
        <form
          action={(fd) => handleSubmit(emailAction, fd)}
          className="rounded-2xl bg-gray-900 border border-gray-800 p-6 space-y-4 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-white">Email Address</h2>
          <p className="text-sm text-gray-400 mb-3">
            Changing your email will send a verification link.
          </p>

          <label className="block text-sm text-gray-300">
            New Email
            <input
              type="email"
              name="email"
              defaultValue={userData.email ?? ''}
              className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500 focus:border-[#629aa9] focus:ring-1 focus:ring-[#629aa9]"
              required
            />
          </label>

          <FormMessage state={emailState} />
          <button type="submit" className={buttonClasses} disabled={loading}>
            {loading ? 'Updating…' : 'Update Email'}
          </button>
        </form>
      )}

      {/* PASSWORD FORM */}
      {activeForm === 'password' && (
        <form
          action={(fd) => handleSubmit(passwordAction, fd)}
          className="rounded-2xl bg-gray-900 border border-gray-800 p-6 space-y-4 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-white">Change Password</h2>
          <p className="text-sm text-gray-400 mb-3">
            Your new password must be at least 6 characters long.
          </p>

          <label className="block text-sm text-gray-300">
            New Password
            <input
              type="password"
              name="password"
              minLength={6}
              className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500 focus:border-[#629aa9] focus:ring-1 focus:ring-[#629aa9]"
              required
            />
          </label>

          <FormMessage state={passwordState} />
          <button type="submit" className={buttonClasses} disabled={loading}>
            {loading ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      )}
    </section>
  );
}

/* Inline helper component */
function FormMessage({ state }: { state: FormState }) {
  if (!state.message) return null;
  return (
    <p
      role="status"
      className={`text-sm ${
        state.success ? 'text-green-500' : 'text-red-500'
      }`}
    >
      {state.message}
    </p>
  );
}
