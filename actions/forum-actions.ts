'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/utils/supabase/server';

interface ForumActionState {
  message: string;
}

export async function postToForum(
  topic: string,
  _prevState: ForumActionState,
  formData: FormData
): Promise<ForumActionState> {
  const title = (formData.get('title') as string)?.trim();
  const content = (formData.get('content') as string)?.trim();

  if (!title || !content) {
    return { message: 'Title and content are required.' };
  }

  const supabase = createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { message: 'You must be logged in to post.' };
  }

  // Insert directly using the auth user ID (it matches profiles.id by FK)
  const { data: insertedPost, error: insertError } = await supabase
    .from('posts')
    .insert({
      title,
      content,
      topic,
      user_id: user.id,
    })
    .select('id, topic')
    .single();

  if (insertError || !insertedPost) {
    console.error('Error inserting post:', insertError);
    return { message: 'Failed to post to forum. Please try again.' };
  }

  // Revalidate the topic list page before redirecting
  revalidatePath(`/forum/${insertedPost.topic}`);

  // Redirect to the new thread’s detail page
  redirect(`/forum/${insertedPost.topic}/${insertedPost.id}`);
}
