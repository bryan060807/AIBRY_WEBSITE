'use client';

import { toggleLike } from '@/actions/comment-actions';

interface LikeButtonProps {
  commentId: string;
  postId: string;
  topic: string;
  isLiked: boolean;
  count: number;
}

export default function LikeButton({ commentId, postId, topic, isLiked, count }: LikeButtonProps) {
  
  // The action uses a wrapper function to pass the required arguments to the Server Action
  const handleToggleLike = () => {
    // This function will execute on the client, calling the Server Action
    toggleLike(commentId, topic, postId);
  };
  
  return (
    <form action={handleToggleLike} className="inline-block">
      <button 
        type="submit" 
        className={`flex items-center space-x-1 text-sm font-medium transition ${isLiked ? 'text-red-500 hover:text-red-400' : 'text-gray-500 hover:text-gray-400'}`}
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <span>{count} {count === 1 ? 'Like' : 'Likes'}</span>
      </button>
    </form>
  );
}