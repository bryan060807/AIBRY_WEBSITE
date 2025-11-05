'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/utils/supabase/server';

interface AuthActionResponse {
  message: string;
  success: boolean;
}

// ==========================================================
// UPDATE USER PROFILE
// ==========================================================
export async function updateProfile(
  _prevState: AuthActionResponse,
  formData: FormData
): Promise<AuthActionResponse> {
  const supabase = createSupabaseServerClient();
  const displayName = (formData.get('display_name') as string)?.trim();

  if (!displayName) {
    return { message: 'Display name cannot be empty.', success: false };
  }

  // Authenticate user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { message: 'Not authenticated.', success: false };
  }

  // Update the existing profile (NOT insert)
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ display_name: displayName })
    .eq('id', user.id);

  if (updateError) {
    console.error('Profile update error:', updateError);
    return { message: 'Failed to update profile. Please try again.', success: false };
  }

  revalidatePath('/dashboard');
  return { message: 'Successfully updated profile!', success: true };
}
