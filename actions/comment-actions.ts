'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/utils/supabase/server';

interface ActionState {
  message: string;
}

// ===================================
// ACTION 1: INSERT COMMENT
// ===================================
export async function insertComment(
  postId: string,
  topic: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const content = (formData.get('content') as string)?.trim();

  if (!content) {
    return { message: 'Comment content is required.' };
  }

  const supabase = createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { message: 'You must be logged in to reply.' };
  }

  // Insert comment directly — auth.user.id == profiles.id (FK)
  const { error: insertError } = await supabase.from('comments').insert({
    post_id: postId,
    user_id: user.id,
    content,
  });

  if (insertError) {
    console.error('Comment insert error:', insertError);
    return { message: 'Failed to post comment. Please try again.' };
  }

  // Refresh thread page to show the new comment
  revalidatePath(`/forum/${topic}/${postId}`);

  return { message: 'Comment posted successfully!' };
}

// ===================================
// ACTION 2: TOGGLE LIKE
// ===================================
export async function toggleLike(
  commentId: string,
  topic: string,
  postId: string
) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/login?message=Sign in to like a comment!');
  }

  const userId = user.id;

  // Check if like exists
  const { data: existingLike } = await supabase
    .from('likes')
    .select('comment_id')
    .eq('user_id', userId)
    .eq('comment_id', commentId)
    .single();

  if (existingLike) {
    // Unlike
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', userId)
      .eq('comment_id', commentId);
    if (error) console.error('Unlike error:', error);
  } else {
    // Like
    const { error } = await supabase
      .from('likes')
      .insert({ user_id: userId, comment_id: commentId });
    if (error) console.error('Like insert error:', error);
  }

  revalidatePath(`/forum/${topic}/${postId}`);
}
