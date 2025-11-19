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

/* ==========================================================
   4. UPDATE AVATAR
   ========================================================== */
export async function updateAvatar(
  _prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  const supabase = createSupabaseServerClient();
  const file = formData.get('avatar') as File;

  if (!file) {
    return { message: 'No file uploaded.', success: false };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/login?message=Please sign in again.');
  }

  const folder = `avatars/${user.id}`;
  const fileExt = file.name.split('.').pop();
  const filePath = `${folder}/avatar.${fileExt}`;

  try {
    // 1️⃣ Delete any existing avatar(s)
    const { data: existingFiles } = await supabase.storage.from('avatars').list(folder);

    if (existingFiles && existingFiles.length > 0) {
      const oldPaths = existingFiles.map((f) => `${folder}/${f.name}`);
      await supabase.storage.from('avatars').remove(oldPaths);
    }

    // 2️⃣ Upload new avatar
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error('Avatar upload error:', uploadError);
      return { message: 'Failed to upload avatar.', success: false };
    }

    // 3️⃣ Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(filePath);

    // 4️⃣ Save URL in profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);

    if (updateError) {
      console.error('Profile update error:', updateError);
      return { message: 'Failed to save avatar URL.', success: false };
    }

    revalidateAccountPages();
    return { message: 'Avatar updated successfully.', success: true };
  } catch (err: any) {
    console.error('Avatar update error:', err.message);
    return { message: err.message || 'Unexpected error updating avatar.', success: false };
  }
}
