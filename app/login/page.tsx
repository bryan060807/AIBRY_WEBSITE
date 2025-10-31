"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Login } from "@/components/Login";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <Login onLogin={handleLogin} onCancel={() => (window.location.href = "/")} />
      {error && (
        <p className="absolute bottom-4 text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
}
