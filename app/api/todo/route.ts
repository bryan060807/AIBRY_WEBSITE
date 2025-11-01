import { NextResponse } from 'next/server';
import { createServerSideClient } from '@/utils/supabase/server';
import type { Database } from '@/types/supabase';

type Todo = Database['public']['Tables']['todos']['Row'];

export async function GET() {
  const supabase = createServerSideClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

export async function POST(req: Request) {
  const supabase = createServerSideClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { title } = await req.json();
  if (!title) return NextResponse.json({ success: false, error: 'Missing title' }, { status: 400 });

  const { data, error } = await supabase.from('todos').insert([{ title, user_id: user.id }]).select();
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}