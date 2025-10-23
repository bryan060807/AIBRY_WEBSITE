'use client';

import { useFormState } from 'react-dom';
import { insertComment } from '@/actions/comment-actions';

// Define props to pass the context of the thread
interface CommentFormProps {
  postId: string;
  topic: string;
}

const initialState = {
  message: '',
};

export default function CommentForm({ postId, topic }: CommentFormProps) {
  
  // Bind the static arguments (postId and topic) to the Server Action
  // The remaining arguments (prevState, formData) will be handled by useFormState
  const boundAction = insertComment.bind(null, postId, topic);
  const [state, formAction] = useFormState(boundAction, initialState);

  // Auto-clear the form field after successful submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    // Call the server action with the form data
    formAction(formData);

    // If a success message is received (after revalidation), clear the form
    // Note: Due to Next.js caching/revalidation, we cannot check 'state' immediately here.
    // For a cleaner UX, we'll manually clear the content field upon submission.
    event.currentTarget.reset();
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-white mb-4">Leave a Comment</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            id="commentContent"
            name="content"
            rows={3}
            placeholder="Share your thoughts or offer support..."
            className="w-full resize-none rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500 focus:border-[#629aa9] focus:ring-1 focus:ring-[#629aa9]"
            required
          />
        </div>
        
        {/* Display success or error messages */}
        {state?.message && (
          <p className={`text-sm ${state.message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
            {state.message}
          </p>
        )}
        
        <button
          type="submit"
          className="rounded bg-[#629aa9] px-6 py-2 font-semibold text-white transition hover:bg-[#4f7f86]"
        >
          Post Comment
        </button>
      </form>
    </div>
  );
}