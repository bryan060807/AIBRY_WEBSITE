'use server';

import { createSupabaseServerClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * Handles user signup (server-side)
 */
export async function signup(
  prevState: { message: string },
  formData: FormData
) {
  const supabase = createSupabaseServerClient();

  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const displayName = String(formData.get('display_name'));

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
    },
  });

  if (error) {
    return { message: error.message };
  }

  revalidatePath('/');
  redirect('/login');
}

/**
 * Handles user login (server-side)
 */
export async function login(
  prevState: { message: string },
  formData: FormData
) {
  const supabase = createSupabaseServerClient();

  const email = String(formData.get('email'));
  const password = String(formData.get('password'));

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { message: error.message };
  }

  revalidatePath('/');
  redirect('/dashboard');
}
