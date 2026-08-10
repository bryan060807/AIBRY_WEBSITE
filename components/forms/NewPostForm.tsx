'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { postToForum } from '@/actions/forum-actions';
import { useAuth } from '@/hooks/useAuth';

interface FormState {
  message: string;
}

interface NewPostFormProps {
  topic: string;
}

const initialState: FormState = { message: '' };

export default function NewPostForm({ topic }: NewPostFormProps) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const boundAction = postToForum.bind(null, topic);
  const [state, formAction] = useFormState(boundAction, initialState);

  const topicDisplayName =
    topic.charAt(0).toUpperCase() + topic.slice(1).toLowerCase();

  return (
    <div className="mt-8 rounded-lg border border-gray-800 bg-gray-900 p-5 shadow-md transition">
      {/* Header toggle */}
      <button
        onClick={() => setIsFormVisible(!isFormVisible)}
        aria-expanded={isFormVisible}
        aria-controls="new-thread-form"
        className="flex w-full items-center justify-between text-left text-white py-2"
      >
        <span className="text-lg font-semibold text-gray-400 hover:text-white transition">
          {isFormVisible
            ? 'Close Submission Form'
            : `+ Start a New Thread in ${topicDisplayName}`}
        </span>
        <span className="text-xl font-bold">{isFormVisible ? '—' : '+'}</span>
      </button>

      {isFormVisible && (
        <div className="mt-3 border-t border-gray-800 pt-5" id="new-thread-form">
          {!loading && !user ? (
            <div className="rounded-md border border-gray-700 bg-black/40 p-4 text-sm text-gray-300">
              <p>You can read forum posts without an account. Log in to start a new thread.</p>
              <Link
                href={`/login?redirect=${encodeURIComponent(pathname)}`}
                className="mt-3 inline-flex min-h-10 items-center justify-center rounded-md bg-[#629aa9] px-4 py-2 font-semibold text-black transition hover:bg-[#7ab3c0]"
              >
                Log in to post
              </Link>
            </div>
          ) : null}

          {loading ? (
            <p className="rounded-md border border-gray-800 bg-black/30 p-4 text-sm text-gray-400">
              Checking your session...
            </p>
          ) : null}

          {user ? (
            <>
              <p className="mb-4 text-gray-400 text-sm">
                Post your story, request for support, or share your thoughts with
                the community.
              </p>

              <form action={formAction} className="space-y-4">
                {/* Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm text-gray-400 mb-1"
                  >
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    placeholder="Give your post a title"
                    className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500 focus:border-[#629aa9] focus:ring-1 focus:ring-[#629aa9]"
                    required
                  />
                </div>

                {/* Content */}
                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm text-gray-400 mb-1"
                  >
                    Content
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    rows={5}
                    placeholder="Write the details of your thread here..."
                    className="w-full resize-none rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500 focus:border-[#629aa9] focus:ring-1 focus:ring-[#629aa9]"
                    required
                  />
                </div>

                {/* Feedback */}
                {state?.message && (
                  <p
                    className={`text-sm ${
                      state.message.toLowerCase().includes('success')
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {state.message}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full rounded bg-[#629aa9] px-6 py-3 font-semibold text-white transition hover:bg-[#4f7f86] disabled:opacity-50"
                >
                  Post Thread
                </button>
              </form>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
