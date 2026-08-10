'use server';

import { revalidatePath } from 'next/cache';
import { getRequestCookieHeader, websiteApiFetch, logWebsiteOperationError } from '@/lib/server/websiteApi';

interface TestimonialResponse {
  message: string;
  success: boolean;
}

export async function submitTestimonial(
  _prevState: TestimonialResponse,
  formData: FormData
): Promise<TestimonialResponse> {
  const content = (formData.get('content') as string)?.trim();

  if (!content) {
    return { message: 'Testimonial cannot be empty.', success: false };
  }

  try {
    await websiteApiFetch('/api/v1/testimonials', {
      method: 'POST',
      cookieHeader: getRequestCookieHeader(),
      body: { content },
    });
  } catch (error) {
    logWebsiteOperationError('testimonial.create', error);
    return { message: 'Failed to submit testimonial.', success: false };
  }

  revalidatePath('/testimonials');
  return { message: 'Thanks for your testimonial!', success: true };
}
