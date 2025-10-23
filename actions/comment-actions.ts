'use server';

import { createServerSideClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// ===================================
//  ACTION 1: INSERT COMMENT
// ===================================
export async function insertComment(postId: string, topic: string, prevState: any, formData: FormData) {
  const content = formData.get('content') as string;

  if (!content) {
    return { message: 'Comment content is required.' };
  }

  const supabase = await createServerSideClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { message: "You must be logged in to reply." };
  }

  // Fetch the user's public profile ID from the profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    console.error('Profile fetch error:', profileError);
    return { message: "Could not find your user profile to post a comment." };
  }

  // Insert the comment into the comments table
  const { error } = await supabase.from('comments').insert({
    post_id: postId,
    user_id: profile.id, // Use the public profile ID
    content: content,
  });

  if (error) {
    console.error('Comment insert error:', error);
    return { message: 'Failed to post comment. Please try again.' };
  }

  // CRITICAL FIX: Revalidate the thread page to show the new comment immediately
  revalidatePath(`/forum/${topic}/${postId}`); 
  
  return { message: 'Comment posted successfully!' };
}


// ===================================
//  ACTION 2: TOGGLE LIKE
// ===================================
export async function toggleLike(commentId: string, topic: string, postId: string) {
    const supabase = await createServerSideClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/login?message=Sign in to like a comment!');
    }

    // Fetch the user's public profile ID (since likes are linked to the public profile)
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

    if (profileError || !profile) {
        console.error('Profile fetch error:', profileError);
        return; // Fail silently or redirect to an error page
    }

    const userId = profile.id;

    // Check if the user has already liked this comment
    const { data: existingLike } = await supabase
        .from('likes')
        .select('comment_id')
        .eq('user_id', userId)
        .eq('comment_id', commentId)
        .single();

    if (existingLike) {
        // If liked, DELETE the like (Unlike)
        await supabase
            .from('likes')
            .delete()
            .eq('user_id', userId)
            .eq('comment_id', commentId);
    } else {
        // If not liked, INSERT a new like
        await supabase
            .from('likes')
            .insert({
                user_id: userId,
                comment_id: commentId,
            });
    }

    // Revalidate the thread page to update the like count immediately
    revalidatePath(`/forum/${topic}/${postId}`);
}