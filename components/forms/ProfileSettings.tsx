"use client";

import { useFormState } from "react-dom";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  updateProfile,
  updateEmail,
  updatePassword,
  updateAvatar,
} from "@/actions/account-actions";
import { useAvatar } from "@/context/AvatarContext";
import { normalizeAvatarUrl } from "@/lib/normalizeAvatarUrl";

type FormState = {
  message?: string;
  success?: boolean;
};

const tabs = ["profile", "email", "password"] as const;
const buttonClasses =
  "w-full bg-[#629aa9] hover:bg-[#4f7f86] text-white rounded-md py-2 font-semibold transition disabled:opacity-50";

export default function ProfileSettings({
  userData,
}: {
  userData: { display_name?: string; email?: string; avatar_url?: string };
}) {
  const [activeForm, setActiveForm] = useState<typeof tabs[number]>("profile");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    normalizeAvatarUrl(userData.avatar_url) || "/images/default-avatar.png"
  );

  const { refreshAvatar } = useAvatar();

  const [profileState, profileAction] = useFormState(updateProfile, {
    message: "",
    success: false,
  });
  const [emailState, emailAction] = useFormState(updateEmail, {
    message: "",
    success: false,
  });
  const [passwordState, passwordAction] = useFormState(updatePassword, {
    message: "",
    success: false,
  });
  const [avatarState, avatarAction] = useFormState(updateAvatar, {
    message: "",
    success: false,
  });

  // Handle local loading state for better UX
  useEffect(() => {
    if (avatarState.message || profileState.message || emailState.message || passwordState.message) {
      setLoading(false);
    }
  }, [avatarState, profileState, emailState, passwordState]);

  useEffect(() => {
    if (avatarState.success) {
      refreshAvatar();
    }
  }, [avatarState.success, refreshAvatar]);

  return (
    <section className="space-y-8">
      <h1 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">Account Settings</h1>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-800 pb-2 text-gray-400">
        {tabs.map((key) => (
          <button
            key={key}
            onClick={() => setActiveForm(key)}
            className={`capitalize pb-1 transition-colors ${
              activeForm === key
                ? "border-b-2 border-[#629aa9] text-white"
                : "hover:text-gray-200"
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {/* === AVATAR UPLOAD === */}
      <form
        action={avatarAction}
        method="post"
        encType="multipart/form-data"
        className="rounded-2xl bg-gray-900 border border-gray-800 p-6 shadow-sm space-y-4"
        onSubmit={() => setLoading(true)}
      >
        <h2 className="text-lg font-semibold text-white mb-2">
          Profile Picture
        </h2>

        <div className="flex items-center space-x-6">
          <div className="relative w-20 h-20 overflow-hidden rounded-full border border-gray-700 bg-gray-800">
            <Image
              src={preview || "/images/default-avatar.png"}
              alt="User avatar"
              fill
              className="object-cover"
              onError={() => setPreview("/images/default-avatar.png")}
              sizes="80px"
              priority
            />
          </div>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            className="text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-gray-300 hover:file:bg-gray-700"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setPreview(URL.createObjectURL(file));
            }}
          />
        </div>

        {avatarState.message && (
          <p
            role="status"
            className={`text-sm ${
              avatarState.success ? "text-green-500" : "text-red-500"
            }`}
          >
            {avatarState.message}
          </p>
        )}

        <button
          type="submit"
          className={buttonClasses}
          disabled={loading}
        >
          {loading ? "Processing..." : "Update Avatar"}
        </button>
      </form>

      {/* === PROFILE FORM === */}
      {activeForm === "profile" && (
        <form
          action={profileAction}
          className="rounded-2xl bg-gray-900 border border-gray-800 p-6 shadow-sm"
          onSubmit={() => setLoading(true)}
        >
          <h2 className="text-lg font-semibold text-white mb-4">
            Display Name
          </h2>
          <label className="block text-sm text-gray-300 mb-4">
            New Display Name
            <input
              type="text"
              name="display_name"
              defaultValue={userData.display_name || ""}
              className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500 focus:border-[#629aa9] focus:ring-1 focus:ring-[#629aa9] outline-none"
              required
            />
          </label>

          {profileState.message && (
            <p
              role="status"
              className={`text-sm mb-4 ${
                profileState.success ? "text-green-500" : "text-red-500"
              }`}
            >
              {profileState.message}
            </p>
          )}

          <button type="submit" className={buttonClasses} disabled={loading}>
            {loading ? "Processing..." : "Update Profile"}
          </button>
        </form>
      )}

      {/* === EMAIL FORM === */}
      {activeForm === "email" && (
        <form
          action={emailAction}
          className="rounded-2xl bg-gray-900 border border-gray-800 p-6 shadow-sm"
          onSubmit={() => setLoading(true)}
        >
          <h2 className="text-lg font-semibold text-white mb-4">
            Email Address
          </h2>
          <label className="block text-sm text-gray-300 mb-4">
            New Email
            <input
              type="email"
              name="email"
              defaultValue={userData.email || ""}
              className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500 focus:border-[#629aa9] focus:ring-1 focus:ring-[#629aa9] outline-none"
              required
            />
          </label>

          {emailState.message && (
            <p
              role="status"
              className={`text-sm mb-4 ${
                emailState.success ? "text-green-500" : "text-red-500"
              }`}
            >
              {emailState.message}
            </p>
          )}

          <button type="submit" className={buttonClasses} disabled={loading}>
            {loading ? "Processing..." : "Update Email"}
          </button>
        </form>
      )}

      {/* === PASSWORD FORM === */}
      {activeForm === "password" && (
        <form
          action={passwordAction}
          className="rounded-2xl bg-gray-900 border border-gray-800 p-6 shadow-sm"
          onSubmit={() => setLoading(true)}
        >
          <h2 className="text-lg font-semibold text-white mb-4">
            Change Password
          </h2>
          <label className="block text-sm text-gray-300 mb-4">
            New Password
            <input
              type="password"
              name="password"
              minLength={6}
              className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500 focus:border-[#629aa9] focus:ring-1 focus:ring-[#629aa9] outline-none"
              required
            />
          </label>

          {passwordState.message && (
            <p
              role="status"
              className={`text-sm mb-4 ${
                passwordState.success ? "text-green-500" : "text-red-500"
              }`}
            >
              {passwordState.message}
            </p>
          )}

          <button type="submit" className={buttonClasses} disabled={loading}>
            {loading ? "Processing..." : "Update Password"}
          </button>
        </form>
      )}
    </section>
  );
}