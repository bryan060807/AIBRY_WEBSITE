'use server';

import { createSupabaseServerClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

interface TestimonialResponse {
  message: string;
  success: boolean;
}

export async function submitTestimonial(
  _prevState: TestimonialResponse,
  formData: FormData
): Promise<TestimonialResponse> {
  const supabase = createSupabaseServerClient();
  const content = (formData.get('content') as string)?.trim();

  if (!content) {
    return { message: 'Testimonial cannot be empty.', success: false };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { message: 'You must be logged in to submit a testimonial.', success: false };
  }

  const { error } = await supabase
    .from('testimonials')
    .insert({ content, user_id: user.id });

  if (error) {
    console.error('Testimonial insert error:', error);
    return { message: 'Failed to submit testimonial.', success: false };
  }

  revalidatePath('/testimonials');
  return { message: 'Thanks for your testimonial!', success: true };
}
