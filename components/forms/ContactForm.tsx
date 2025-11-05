'use client';

import { useFormState } from 'react-dom';
import { sendContactMessage } from '@/actions/contact-actions';

const initialState = { message: '' };

export default function ContactForm() {
  const [state, formAction] = useFormState(sendContactMessage, initialState);

  return (
    <section className="mx-auto mt-16 mb-24 max-w-xl">
      <h2 className="mb-6 text-center text-2xl font-bold text-white">
        Contact AIBRY
      </h2>
      <form
        action={formAction}
        className="space-y-4 rounded-lg border border-gray-800 bg-gray-900 p-6 shadow"
      >
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-gray-300"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500"
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-gray-300"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label
            htmlFor="message"
            className="mb-1 block text-sm font-medium text-gray-300"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="w-full resize-none rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500"
            placeholder="What’s on your mind?"
            required
          />
        </div>

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

        <button
          type="submit"
          className="w-full rounded bg-[#629aa9] px-6 py-3 font-semibold text-white transition hover:bg-[#4f7f86]"
        >
          Send Message
        </button>
      </form>
    </section>
  );
}
