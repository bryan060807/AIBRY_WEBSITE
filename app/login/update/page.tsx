"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    setMessage(error ? error.message : "Password updated. You can log in now.");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <form
        onSubmit={handleUpdate}
        className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-sm w-full"
      >
        <h2 className="text-2xl font-bold text-indigo-400 mb-4">Set New Password</h2>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-gray-200 mb-4"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-md"
        >
          Update Password
        </button>
        {message && <p className="text-gray-400 text-sm mt-4">{message}</p>}
      </form>
    </div>
  );
}
