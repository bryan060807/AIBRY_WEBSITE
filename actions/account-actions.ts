'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

interface ActionResponse {
  message: string;
  success: boolean;
}

function revalidateAccountPages() {
  revalidatePath('/dashboard');
  revalidatePath('/profile');
}

/* ==========================================================
   1. UPDATE PROFILE (Display Name)
   ========================================================== */
export async function updateProfile(
  _prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  const supabase = createSupabaseServerClient();
  const displayName = (formData.get('display_name') as string)?.trim();

  if (!displayName) {
    return { message: 'Display name cannot be empty.', success: false };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/login?message=Please sign in again.');
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ display_name: displayName })
    .eq('id', user.id);

  if (updateError) {
    console.error('Profile update error:', updateError);
    return { message: 'Failed to update profile.', success: false };
  }

  revalidateAccountPages();
  return { message: 'Profile updated successfully.', success: true };
}

/* ==========================================================
   2. UPDATE EMAIL ADDRESS
   ========================================================== */
export async function updateEmail(
  _prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  const supabase = createSupabaseServerClient();
  const email = (formData.get('email') as string)?.trim();

  if (!email) {
    return { message: 'Email cannot be empty.', success: false };
  }

  const { error } = await supabase.auth.updateUser({ email });

  if (error) {
    console.error('Email update error:', error);
    return { message: 'Failed to update email.', success: false };
  }

  revalidateAccountPages();
  return { message: 'Email updated successfully. Please verify your inbox.', success: true };
}

/* ==========================================================
   3. UPDATE PASSWORD
   ========================================================== */
export async function updatePassword(
  _prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  const supabase = createSupabaseServerClient();
  const password = (formData.get('password') as string)?.trim();

  if (!password || password.length < 6) {
    return { message: 'Password must be at least 6 characters.', success: false };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error('Password update error:', error);
    return { message: 'Failed to update password.', success: false };
  }

  revalidateAccountPages();
  return { message: 'Password updated successfully.', success: true };
}
