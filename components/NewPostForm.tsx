'use client';

import { useFormState } from 'react-dom';
import { postToForum } from '@/actions/forum-actions';
import { useState } from 'react';

// Define the component props to accept the topic
interface NewPostFormProps {
  topic: string;
}

const initialState = {
  message: '',
};

export default function NewPostForm({ topic }: NewPostFormProps) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  // Use .bind() to pre-fill the first argument (topic) of the Server Action
  const boundAction = postToForum.bind(null, topic);

  const [state, formAction] = useFormState(boundAction, initialState);

  // Function to clear the form and hide it after a successful submission
  const handleAction = async (formData: FormData) => {
    await formAction(formData);
    // If successful (or if you add specific success state checks), hide the form
    // For now, we rely on the redirect/revalidate in the server action
    setIsFormVisible(false);
  };
  
  // Display name for the topic
  const topicDisplayName = topic.charAt(0).toUpperCase() + topic.slice(1);

  return (
    <div className="mt-8 rounded-lg border border-gray-800 bg-gray-900 p-4 shadow-lg">
      
      {/* Collapsible Header/Button */}
      <button 
        onClick={() => setIsFormVisible(!isFormVisible)}
        className="w-full text-left flex items-center justify-between text-white py-2"
      >
        <span className="text-lg font-semibold text-gray-400 hover:text-white transition">
            {isFormVisible ? `Close Submission Form` : `+ Start a New Thread in ${topicDisplayName}`}
        </span>
        <span className="text-xl font-bold">{isFormVisible ? '—' : '+'}</span>
      </button>

      {/* Collapsible Form Content */}
      {isFormVisible && (
        <div className="pt-4 border-t border-gray-800 mt-2">
            <p className="mb-4 text-gray-400">
                Post your story, request for support, or share hope with the community.
            </p>
            <form action={handleAction} className="space-y-4">
                {/* Input field for the post title */}
                <div>
                    <input
                        type="text"
                        name="title"
                        placeholder="Give your post a title"
                        className="w-full rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500 focus:border-[#629aa9] focus:ring-1 focus:ring-[#629aa9]"
                        required
                    />
                </div>

                {/* Textarea for the post content */}
                <div>
                    <textarea
                        name="content"
                        rows={5}
                        placeholder="Write the details of your thread here..."
                        className="w-full resize-none rounded-md border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-500 focus:border-[#629aa9] focus:ring-1 focus:ring-[#629aa9]"
                        required
                    />
                </div>
                
                {state?.message && <p className={`text-sm ${state.message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>{state.message}</p>}
                
                <button
                    type="submit"
                    className="w-full rounded bg-[#629aa9] px-6 py-3 font-semibold text-white transition hover:bg-[#4f7f86]"
                >
                    Post Thread
                </button>
            </form>
        </div>
      )}
    </div>
  );
}