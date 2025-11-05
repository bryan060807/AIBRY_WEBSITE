'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';

/**
 * PasswordReset — accessible modal overlay for password reset email requests.
 */
export default function PasswordReset() {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  /** Close modal on Escape key */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        router.back();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  /** Trap focus within modal */
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    function handleTab(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }

    document.addEventListener('keydown', handleTab);
    firstElement?.focus();

    return () => document.removeEventListener('keydown', handleTab);
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email address.');
      return;
    }

    setLoading(true);

    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/login/update`,
      });

      if (error) throw error;

      toast.success('Check your inbox for a password reset link.');
      router.push('/login');
    } catch (err: any) {
      console.error('Password reset error:', err);
      toast.error(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-title"
      ref={modalRef}
    >
      <div className="relative w-full max-w-sm m-4 rounded-xl border border-gray-700 bg-gray-800 p-8 shadow-2xl">
        <button
          onClick={() => router.back()}
          className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
          aria-label="Close reset form"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>

        <div className="mb-6 text-center">
          <h2 id="reset-title" className="text-2xl font-bold text-[#629aa9]">
            Reset Password
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Enter your account email to receive a password reset link.
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="email"
              required
              className="w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-gray-200 placeholder-gray-500 focus:border-[#629aa9] focus:ring-2 focus:ring-[#629aa9] transition duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center rounded-md py-3 px-4 font-bold text-white transition duration-200 ${
              loading
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-[#629aa9] hover:bg-[#4f7f86]'
            }`}
          >
            {loading ? 'Sending link…' : 'Send Reset Link'}
          </button>

          <p className="mt-2 text-center text-sm text-gray-400">
            Remembered your password?{' '}
            <a href="/login" className="text-[#629aa9] hover:text-[#4f7f86]">
              Back to Sign In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
