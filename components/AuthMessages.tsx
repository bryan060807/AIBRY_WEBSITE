"use client";

import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface AuthMessagesProps {
  error?: string | null;
  message?: string | null;
}

export default function AuthMessages({ error, message }: AuthMessagesProps) {
  useEffect(() => {
    // Check for an error message and show it
    if (error) {
      toast.error(error);
    }
    
    // Check for a success message and show it
    if (message) {
      // This is the specific one you wanted! We'll show it a bit longer.
      if (message.includes('Check your email for verification')) {
        toast.success(message, { duration: 6000 });
      } else {
        toast.success(message);
      }
    }
  }, [error, message]); // Re-run if error or message changes

  // This component doesn't render any visible HTML, it just triggers toasts
  return null;
}