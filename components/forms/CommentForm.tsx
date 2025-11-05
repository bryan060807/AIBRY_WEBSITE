'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { insertComment } from '@/actions/comment-actions';

interface FormState {
  message: string;
}

interface CommentFormProps {
  postId: string;
  topic: string;
  parentId?: string;
  placeholder?: string;
  compact?: boolean;
}

const initialState: FormState = { message: '' };

export default function CommentForm({
  postId,
  topic,
  parentId,
  placeholder = 'Write your comment...',
  compact = false,
}: CommentFormProps) {
  const [visible, setVisible] = useState(true);
  const [content, setContent] = useState('');

  // bind static args first
  const boundAction = insertComment.bind(null, postId, topic);
  const [state, formAction] = useFormState(boundAction, initialState);

  if (!visible && state?.message?.toLowerCase().includes('success')) {
    return (
      <p className="mt-3 text-sm text-green-500">
        {state.message || 'Comment posted successfully!'}
      </p>
    );
  }

  return (
    <form
      action={formAction} // ✅ use the useFormState action directly
      className={`${
        compact ? 'p-3' : 'p-5'
      } mt-6 rounded-lg border border-gray-800 bg-gray-900 space-y-4`}
    >
      {!compact && (
        <h3 className="text-lg font-semibold text-white">Leave a Comment</h3>
      )}

      <textarea
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={compact ? 2 : 4}
        className="w-full resize-none rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500 focus:border-[#629aa9] focus:ring-1 focus:ring-[#629aa9]"
        required
      />

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

      <div className="flex justify-end gap-3">
        {compact && (
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="px-4 py-2 text-gray-400 hover:text-gray-200 text-sm"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="rounded bg-[#629aa9] hover:bg-[#4f7f86] px-5 py-2 font-semibold text-white transition"
        >
          Post
        </button>
      </div>
    </form>
  );
}
