import { NextResponse } from 'next/server';
import { createServerSideClient } from '@/utils/supabase/server';

export async function POST() {
  const supabase = createServerSideClient();

  try {
    await supabase.auth.signOut();
    return NextResponse.json({ success: true, message: 'Logged out successfully.' });
  } catch (error: any) {
    console.error('Logout failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}