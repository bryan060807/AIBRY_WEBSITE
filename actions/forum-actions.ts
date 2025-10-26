'use server';

import { createServerSideClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function postToForum(topic: string, prevState: any, formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  if (!content || !title) {
    return { message: 'Title and content are required.' };
  }

  const supabase = await createServerSideClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { message: "You must be logged in to post." };
  }

  // --- START FIX ---
  // We must use the 'profile' ID, not the 'auth.user' ID.
  // Fetch the user's public profile ID from the profiles table.
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    console.error('Profile fetch error:', profileError);
    // This can happen if the user was created before the auth trigger.
    return { message: "Could not find your user profile. Please try logging out and back in." };
  }
  // --- END FIX ---


  // UPDATED INSERT: Use the correct profile.id
  const { data: insertedPost, error } = await supabase
    .from('posts')
    .insert({
      title,
      content,
      topic,
      user_id: profile.id, // Use profile.id, not user.id
    })
    .select('id, topic') // Select the ID and topic for the redirect
    .single();

  if (error) {
    console.error('Error inserting post:', error);
    // Check your Vercel logs for this error!
    return { message: 'Failed to post to forum. A database error occurred.' };
  }

  // CORRECT REDIRECT: Use the ID of the newly created post
  if (insertedPost?.id && insertedPost?.topic) {
    const newPath = `/forum/${insertedPost.topic}/${insertedPost.id}`;
    
    // Revalidate the list page before redirecting
    revalidatePath(`/forum/${insertedPost.topic}`);
    
    // Redirect to the new post's detail page
    redirect(newPath); // Note: redirect needs to be called, not returned
  }
  
  // Fallback
  revalidatePath(`/forum/${topic}`);
  redirect(`/forum/${topic}`);
}