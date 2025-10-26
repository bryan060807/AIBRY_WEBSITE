// app/dashboard/actions.ts
'use server';

import { createServerSideClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

// --- Action 1: Update public profile data (display_name) ---
export async function updateProfile(prevState: any, formData: FormData) {
  const supabase = await createServerSideClient();
  const displayName = formData.get('display_name') as string;

  if (!displayName) {
    return { message: 'Display Name cannot be empty.', success: false }; // FIX
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { message: 'Not authenticated.', success: false }; // FIX
  }

  const { error } = await supabase
    .from('profiles')
    .update({ display_name: displayName })
    .eq('id', user.id);

  if (error) {
    return { message: error.message, success: false }; // FIX
  }

  revalidatePath('/dashboard');
  return { message: 'Successfully updated profile!', success: true };
}

// --- Action 2: Update secure auth data (email/phone) ---
export async function updateAuth(prevState: any, formData: FormData) {
  const supabase = await createServerSideClient();
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;

  const { error } = await supabase.auth.updateUser({
    email,
    phone,
  });

  if (error) {
    return { message: error.message, success: false }; // FIX
  }

  revalidatePath('/dashboard');
  return { message: 'Successfully updated account info!', success: true };
}

// --- Action 3: Update password ---
export async function updatePassword(prevState: any, formData: FormData) {
  const supabase = await createServerSideClient();
  const password = formData.get('password') as string;

  if (password.length < 6) {
    return { message: 'Password must be at least 6 characters.', success: false }; // FIX
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { message: error.message, success: false }; // FIX
  }

  return { message: 'Successfully updated password!', success: true };
}