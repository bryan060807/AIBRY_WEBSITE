// app/auth/actions.ts
'use server';

import { createServerSideClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function login(prevState: any, formData: FormData) {
  // ... your existing login function
  const supabase = await createServerSideClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { message: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signup(prevState: any, formData: FormData) {
  // ... your existing signup function
  const supabase = await createServerSideClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const phone = formData.get('phone') as string;
  const displayName = formData.get('display_name') as string;

  if (!displayName) {
    return { message: 'Display Name is required.' };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    phone: phone || undefined,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });

  if (error) {
    return { message: error.message };
  }

  return { message: 'Check your email to confirm your account!' };
}

// --- ADD THIS NEW FUNCTION ---
export async function logout() {
  'use server';
  
  const supabase = await createServerSideClient();
  await supabase.auth.signOut();
  
  // Revalidate the entire site and redirect to login
  revalidatePath('/', 'layout');
  redirect('/login');
}