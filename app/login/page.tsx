"use client";

import { Suspense } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginShell />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginShell() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-160px)] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-md border border-gray-800 bg-gray-950/70 p-6 text-gray-300">
        Loading account form
      </div>
    </main>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register, user, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const redirectTo = useMemo(
    () => safeRedirectPath(searchParams.get("redirect")),
    [searchParams]
  );

  useEffect(() => {
    if (!loading && user) {
      router.replace(redirectTo);
      router.refresh();
    }
  }, [loading, redirectTo, router, user]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const user =
        mode === "register"
          ? await register({ email, password, displayName, username })
          : await login({ email, password });

      if (!user) {
        throw new Error("Login completed, but the website session was not available yet.");
      }

      router.replace(redirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  }

  const authError =
    searchParams.get("error") ||
    searchParams.get("aibry_id_error") ||
    searchParams.get("auth_error");

  return (
    <main className="mx-auto flex min-h-[calc(100vh-160px)] max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-[#629aa9]">Account</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">
          {mode === "register" ? "Create your account" : "Log in"}
        </h1>
      </div>

      {authError ? (
        <p className="mb-4 rounded-md border border-red-900/70 bg-red-950/30 px-3 py-2 text-sm text-red-100">
          {authErrorMessage(authError)}
        </p>
      ) : null}

      <div className="mb-4 rounded-md border border-gray-800 bg-gray-950/70 p-6">
        <a
          href="/auth/aibry-id/login"
          className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#629aa9]"
        >
          Continue with AIBRY ID
        </a>
        <p className="mt-3 text-center text-xs text-gray-500">
          Use an existing AIBRY ID account. Public AIBRY ID signup is not open yet.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4 rounded-md border border-gray-800 bg-gray-950/70 p-6">
        <div className="grid grid-cols-2 rounded-md border border-gray-800 p-1">
          {(["login", "register"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMode(item)}
              className={`rounded px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[#629aa9] ${
                mode === item ? "bg-[#629aa9] text-black" : "text-gray-300 hover:text-white"
              }`}
            >
              {item === "login" ? "Login" : "Register"}
            </button>
          ))}
        </div>

        {mode === "register" ? (
          <>
            <Field label="Display name" value={displayName} onChange={setDisplayName} />
            <Field label="Username" value={username} onChange={setUsername} />
          </>
        ) : null}

        <Field label="Email" type="email" value={email} onChange={setEmail} required />
        <Field label="Password" type="password" value={password} onChange={setPassword} required />

        {error ? (
          <p className="rounded-md border border-red-900/70 bg-red-950/30 px-3 py-2 text-sm text-red-100">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[#629aa9] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#7ab3c0] focus:outline-none focus:ring-2 focus:ring-[#629aa9] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {mode === "register" ? "Create account" : "Log in"}
        </button>
      </form>
    </main>
  );
}

function authErrorMessage(code: string) {
  switch (code) {
    case "aibry_id_verified_email_required":
      return "AIBRY ID needs a verified email before it can create a website session. Verify your AIBRY ID email, then try again.";
    case "aibry_id_link_required":
      return "That AIBRY ID account is not linked to a website account yet. Log in with your Website account first, or this needs a Website API account-linking follow-up.";
    case "aibry_id_callback_failed":
      return "AIBRY ID sign-in reached the website, but the callback could not be completed.";
    case "invalid_aibry_id_state":
      return "AIBRY ID sign-in expired or did not match this browser session. Please try again.";
    case "missing_aibry_id_code":
      return "AIBRY ID did not return the required sign-in code. Please try again.";
    case "invalid_aibry_id_token":
      return "AIBRY ID returned a token the website could not verify.";
    case "invalid_aibry_id_identity":
      return "AIBRY ID did not return a usable account identity for the website.";
    default:
      return "AIBRY ID sign-in could not be completed.";
  }
}

function safeRedirectPath(value: string | null) {
  if (!value) return "/profile";
  if (!value.startsWith("/") || value.startsWith("//")) return "/profile";

  try {
    const parsed = new URL(value, "https://aibrylabs.com");
    if (parsed.origin !== "https://aibrylabs.com") return "/profile";
    return `${parsed.pathname}${parsed.search}${parsed.hash}` || "/profile";
  } catch {
    return "/profile";
  }
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-medium text-gray-200">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-md border border-gray-800 bg-black px-3 text-gray-100 outline-none transition focus:border-[#629aa9] focus:ring-2 focus:ring-[#629aa9]/40"
      />
    </label>
  );
}
