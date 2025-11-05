'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/utils/supabase/server';

interface ActionResponse {
  message: string;
  success: boolean;
}

export async function updateProfile(_: any, formData: FormData): Promise<ActionResponse> {
  try {
    const supabase = createSupabaseServerClient();
    const displayName = (formData.get('display_name') as string)?.trim();
    if (!displayName) return { message: 'Display name cannot be empty.', success: false };

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { message: 'Not authenticated.', success: false };

    const { data, error } = await supabase
      .from('profiles')
      .update({ display_name: displayName })
      .eq('user_id', user.id); // <- make sure this matches your schema

    if (error) throw error;
    if (data?.length === 0) return { message: 'No profile found to update.', success: false };

    revalidatePath('/dashboard');
    return { message: 'Successfully updated profile!', success: true };
  } catch (err: any) {
    return { message: err.message || 'An unexpected error occurred.', success: false };
  }
}

export async function updateAuth(_: any, formData: FormData): Promise<ActionResponse> {
  try {
    const supabase = createSupabaseServerClient();
    const email = (formData.get('email') as string)?.trim();

    const { error } = await supabase.auth.updateUser({ email });
    if (error) throw error;

    revalidatePath('/dashboard');
    return { message: 'Successfully updated account info!', success: true };
  } catch (err: any) {
    return { message: err.message || 'An unexpected error occurred.', success: false };
  }
}

export async function updatePassword(_: any, formData: FormData): Promise<ActionResponse> {
  try {
    const supabase = createSupabaseServerClient();
    const password = (formData.get('password') as string)?.trim();
    if (!password || password.length < 6)
      return { message: 'Password must be at least 6 characters.', success: false };

    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;

    revalidatePath('/dashboard');
    return { message: 'Successfully updated password!', success: true };
  } catch (err: any) {
    return { message: err.message || 'An unexpected error occurred.', success: false };
  }
}
