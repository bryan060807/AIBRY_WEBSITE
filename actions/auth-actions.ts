'use server';

import { revalidatePath } from 'next/cache';
import { createServerSideClient } from '@/utils/supabase/server';
import type { Database } from '@/types/supabase';

export async function updateProfile(prevState: any, formData: FormData) {
  const supabase = createServerSideClient(); // typed client

  const displayName = formData.get('display_name') as string;
  if (!displayName) {
    return { message: 'Display Name cannot be empty.', success: false };
  }

  const { data, error: userError } = await supabase.auth.getUser();
  if (userError || !data?.user) {
    return { message: 'Not authenticated.', success: false };
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .insert([
      {
        id: data.user.id,
        display_name: displayName,
      },
    ])
    .select();

  if (profileError) {
    return { message: profileError.message, success: false };
  }

  revalidatePath('/dashboard');
  return { message: 'Successfully updated profile!', success: true };
}