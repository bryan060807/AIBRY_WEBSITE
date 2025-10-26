// components/NewCommentForm.tsx
'use client';

import { useFormState } from 'react-dom';
import { insertComment } from '@/actions/comment-actions';
import { useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';

const initialState = {
  message: '',
};

interface NewCommentFormProps {
  postId: string;
  topic: string;
}

// Submit button component to show pending state
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded bg-[#629aa9] px-5 py-2.5 font-semibold text-white transition hover:bg-[#4f7f86] disabled:opacity-50"
    >
      {pending ? 'Posting...' : 'Post Reply'}
    </button>
  );
}

export default function NewCommentForm({ postId, topic }: NewCommentFormProps) {
  // Bind the postId and topic to the server action
  const boundAction = insertComment.bind(null, postId, topic);
  const [state, formAction] = useFormState(boundAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [formKey, setFormKey] = useState(Date.now()); // State to force re-render

  useEffect(() => {
    // If the submission was successful, clear the form
    if (state.message.includes('success')) {
      formRef.current?.reset();
      // Change the key to reset the form state
      setFormKey(Date.now()); 
    }
  }, [state]);

  return (
    <form
      key={formKey} // Use key to force reset
      ref={formRef}
      action={formAction}
      className="space-y-4"
    >
      <div>
        <textarea
          name="content"
          rows={4}
          placeholder="Write your reply here..."
          className="w-full resize-none rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500 focus:border-[#629aa9] focus:ring-1 focus:ring-[#629aa9]"
          required
        />
      </div>
      
      <div className="flex items-center justify-between">
        {state?.message && (
          <p className={`text-sm ${state.message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
            {state.message}
          </p>
        )}
        <div className="flex-grow" /> {/* Pushes button to the right */}
        <SubmitButton />
      </div>
    </form>
  );
}