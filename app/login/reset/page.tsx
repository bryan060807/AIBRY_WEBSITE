"use client";
import { useState } from "react";
import { supabase } from "@/lib/supadaseClient";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login/update`,
    });
    setMessage(error ? error.message : "Check your email for the reset link.");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <form
        onSubmit={handleReset}
        className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-sm w-full"
      >
        <h2 className="text-2xl font-bold text-indigo-400 mb-4">Reset Password</h2>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-gray-200 mb-4"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-md"
        >
          Send Reset Link
        </button>
        {message && <p className="text-gray-400 text-sm mt-4">{message}</p>}
      </form>
    </div>
  );
}
