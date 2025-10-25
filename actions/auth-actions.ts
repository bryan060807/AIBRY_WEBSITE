// actions/auth-actions.ts

'use server';

import { createServerSideClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const displayName = formData.get('display_name') as string;
  
  // Basic validation for display name if signing up
  if (!displayName || displayName.length < 3) {
      return redirect(`/login?error=${encodeURIComponent('Display name must be at least 3 characters.')}`);
  }

  const supabase = await createServerSideClient();

  // 1. Sign up the user in auth.users table
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Sign up error:', error);
    return redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
  
  // 2. Insert the display name into the public.profiles table
  if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id, // Links to auth.users.id
          display_name: displayName,
      });

      if (profileError) {
          console.error('Profile creation error:', profileError);
          // FINAL FIX: We log the error but allow the function to complete the final redirect. 
          // The user exists, but their profile row is missing.
          // They will see 'Anonymous' until they manually edit their profile or until RLS is fixed.
          return redirect(`/login?error=${encodeURIComponent('Sign up successful, but profile name could not be saved.')}`);
      }
  }

  // Redirect to a page telling the user to check their email
  return redirect('/login?message=Check your email to complete signup!');
}

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createServerSideClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Sign in error:', error);
    // Redirect back to login with an error message
    return redirect(`/login?error=${encodeURIComponent('Invalid credentials')}`);
  }

  // UPDATED: Successful sign-in now redirects to the dashboard
  return redirect('/dashboard');
}

export async function signOut() {
  const supabase = await createServerSideClient();
  await supabase.auth.signOut();
  return redirect('/login');
}