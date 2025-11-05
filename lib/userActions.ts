'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/utils/supabase/server';

interface ActionResponse {
  message: string;
  success: boolean;
}

interface Profile {
  id: string;
  user_id?: string;
  display_name: string;
}

/**
 * Update the user's profile display name
 */
export async function updateProfile(_: any, formData: FormData): Promise<ActionResponse> {
  try {
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
      return { message: 'Not authenticated.', success: false };
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ display_name: displayName })
      .eq('id', user.id) // ✅ assuming your profiles table uses `id` as FK to auth.users
      .select(); // ✅ ensures `data` is typed as Profile[]

    if (error) throw error;
    if (!data || data.length === 0) {
      return { message: 'No profile found to update.', success: false };
    }

    revalidatePath('/dashboard');
    return { message: 'Successfully updated profile!', success: true };
  } catch (err: any) {
    return {
      message: err.message || 'An unexpected error occurred while updating profile.',
      success: false,
    };
  }
}

/**
 * Update the user's email address
 */
export async function updateAuth(_: any, formData: FormData): Promise<ActionResponse> {
  try {
    const supabase = createSupabaseServerClient();
    const email = (formData.get('email') as string)?.trim();

    if (!email) {
      return { message: 'Email cannot be empty.', success: false };
    }

    const { error } = await supabase.auth.updateUser({ email });

    if (error) throw error;

    revalidatePath('/dashboard');
    return { message: 'Successfully updated account info!', success: true };
  } catch (err: any) {
    return {
      message: err.message || 'An unexpected error occurred while updating email.',
      success: false,
    };
  }
}

/**
 * Update the user's password
 */
export async function updatePassword(_: any, formData: FormData): Promise<ActionResponse> {
  try {
    const supabase = createSupabaseServerClient();
    const password = (formData.get('password') as string)?.trim();

    if (!password || password.length < 6) {
      return { message: 'Password must be at least 6 characters.', success: false };
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) throw error;

    revalidatePath('/dashboard');
    return { message: 'Successfully updated password!', success: true };
  } catch (err: any) {
    return {
      message: err.message || 'An unexpected error occurred while updating password.',
      success: false,
    };
  }
}
