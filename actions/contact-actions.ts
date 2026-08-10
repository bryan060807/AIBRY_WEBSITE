'use server';

import { redirect } from 'next/navigation';
import {
  websiteApiFetch,
  logWebsiteOperationError,
  WebsiteApiError,
} from '@/lib/server/websiteApi';

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

  try {
    await websiteApiFetch('/api/contact-messages', {
      method: 'POST',
      body: { name, email, message },
    });
  } catch (error) {
    logWebsiteOperationError('contact.message.create', error);
    return {
      message:
        error instanceof WebsiteApiError
          ? error.message
          : 'Failed to send message. Please try again.',
    };
  }

  // Redirect user to success page
  redirect('/contact/success');
}
