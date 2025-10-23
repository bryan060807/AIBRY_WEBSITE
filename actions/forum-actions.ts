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

  // UPDATED INSERT: Use .select() to return the ID of the newly inserted post
  const { data: insertedPost, error } = await supabase
    .from('posts')
    .insert({
      title,
      content,
      topic,
      user_id: user.id,
    })
    .select('id, topic') // Select the ID and topic for the redirect
    .single(); // Expect one returned record

  if (error) {
    console.error('Error inserting data:', error);
    return { message: 'Failed to post to forum. Please try again.' };
  }

  // CORRECT REDIRECT: Use the ID of the newly created post to redirect to its detail page
  if (insertedPost?.id && insertedPost?.topic) {
    // The path is now /forum/[topic]/[post_id]
    const newPath = `/forum/${insertedPost.topic}/${insertedPost.id}`;
    
    // We can still revalidate the list page cache before redirecting
    revalidatePath(`/forum/${insertedPost.topic}`);
    
    // Redirect to the new post's detail page
    return redirect(newPath);
  }
  
  // Fallback: If for some reason the ID wasn't returned, just redirect to the list
  revalidatePath(`/forum/${topic}`);
  return redirect(`/forum/${topic}`);
}