'use server';

import { createSupabaseServerClient } from '@/utils/supabase/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function signup(formData: FormData) {
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

export async function login(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { message: error.message };
  }

  revalidatePath('/');
  redirect('/dashboard');
}

export async function logout() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath('/');
  redirect('/');
}
