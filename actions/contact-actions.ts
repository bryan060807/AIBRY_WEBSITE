'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/utils/supabase/server';

interface ContactActionState {
  message: string;
}

export async function sendContactMessage(
  _prevState: ContactActionState,
  formData: FormData
): Promise<ContactActionState> {
  const name = (formData.get('name') as string)?.trim();
  const email = (formData.get('email') as string)?.trim();
  const message = (formData.get('message') as string)?.trim();

  if (!name || !email || !message) {
    return { message: 'All fields are required.' };
  }

  const supabase = createSupabaseServerClient();

  const { error } = await supabase.from('contact_messages').insert([
    {
      name,
      email,
      message,
    },
  ]);

  if (error) {
    console.error('Error inserting contact message:', error);
    return { message: 'Failed to send message. Please try again.' };
  }

  // Redirect user to success page
  redirect('/contact/success');
}
