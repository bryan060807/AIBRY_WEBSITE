import Link from 'next/link';
import { createServerSideClient } from '@/utils/supabase/server';
import CommentForm from '@/components/CommentForm';
import { toggleLike } from '@/actions/comment-actions';

// Define the expected parameters from the dynamic route segments
interface PostDetailPageProps {
  params: {
    topic: string;
    post_id: string;
  };
}

// Helper component for the Like button (REMOVED LOGIC - ONLY STYLING REMAINS)
function LikeButton({ commentId, postId, topic, isLiked, count }: { commentId: string, postId: string, topic: string, isLiked: boolean, count: number }) {
  // We remove the form action call to isolate the error
  return (
    <div className="inline-block">
      <button 
        type="submit" 
        className={`flex items-center space-x-1 text-sm font-medium transition ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        <span>{/* count */} 0 Likes (Debugging)</span>
      </button>
    </div>
  );
}

// Make the main page a Server Component
export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { topic, post_id } = params;
  const supabase = await createServerSideClient();

  // 1. Get current user's profile ID for like checks
  const { data: { user } } = await supabase.auth.getUser();
  
  // 2. Fetch the Post and all related Comments (LIKES REMOVED FROM QUERY)
  const { data: post, error } = await supabase
    .from('posts')
    .select(`
        id, content, created_at, title, topic, 
        user_id:profiles!inner(display_name),
        comments (
            id, content, created_at,
            user_id:profiles!comments_user_id_fkey!inner(display_name)
        )
    `)
    .eq('id', post_id)
    .order('created_at', { foreignTable: 'comments', ascending: true }) // Order comments oldest first
    .single();

  if (error || !post) {
    console.error('Error fetching single post/comments:', error);
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="mb-4 text-4xl font-bold text-white">Post Not Found</h1>
        <Link href={`/forum/${topic}`} className="mt-8 inline-block text-[#629aa9] hover:text-white transition">
          &larr; Go back to {topic.charAt(0).toUpperCase() + topic.slice(1)} Feed
        </Link>
      </main>
    );
  }
  
  const topicDisplayName = topic.charAt(0).toUpperCase() + topic.slice(1);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href={`/forum/${topic}`} className="mb-8 inline-block text-gray-400 hover:text-white transition">
        &larr; Back to {topicDisplayName} Feed
      </Link>

      {/* Main Post Content */}
      <div className="rounded-lg border border-gray-700 bg-gray-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>
        <p className="mb-6 text-sm text-gray-500">
          Posted by **{post.user_id?.display_name || 'Anonymous'}** on {new Date(post.created_at).toLocaleDateString()}
        </p>
        
        <hr className="border-gray-800 mb-6" />

        <p className="text-lg text-gray-300 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Comment Section */}
      <section className="mt-10">
          <h2 className="text-2xl font-bold text-white mb-6">Discussion ({post.comments.length})</h2>
          
          {/* Display Comments List */}
          <div className="space-y-4">
              {post.comments.map((comment: any) => (
                  <div key={comment.id} className="rounded-lg bg-[#18181b] p-4 border border-gray-800">
                      <div className="flex justify-between items-start">
                          <p className="text-sm font-semibold text-gray-400">
                            **{comment.user_id?.display_name || 'Anonymous'}** <span className="text-xs font-normal text-gray-600 ml-2">
                                {new Date(comment.created_at).toLocaleString()}
                            </span>
                          </p>
                      </div>
                      <p className="text-gray-300 mt-2 whitespace-pre-wrap">{comment.content}</p>

                      {/* Like Button & Count (Debugging version) */}
                      <div className="mt-3">
                          <LikeButton
                            commentId={comment.id}
                            postId={post_id}
                            topic={topic}
                            isLiked={false} // Always false for debugging
                            count={0} // Always 0 for debugging
                          />
                      </div>
                  </div>
              ))}
              
              {post.comments.length === 0 && (
                  <p className="text-gray-500 py-4 text-center">No comments yet. Be the first to reply!</p>
              )}
          </div>
          
          {/* Comment Submission Form */}
          {user ? (
            <CommentForm postId={post_id} topic={topic} />
          ) : (
            <div className="mt-8 p-4 text-center rounded-lg bg-gray-900 border border-gray-800">
                <p className="text-gray-400">Please <Link href="/login" className="text-[#629aa9] hover:text-white font-semibold">sign in</Link> to leave a reply.</p>
            </div>
          )}
      </section>
    </main>
  );
}