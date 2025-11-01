import { NextResponse } from 'next/server';
import { createServerSideClient } from '@/utils/supabase/server';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const supabase = createServerSideClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { completed, title } = body;

  const { data, error } = await supabase
    .from('todos')
    .update({ completed, title })
    .eq('id', params.id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const supabase = createServerSideClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { error } = await supabase.from('todos').delete().eq('id', params.id).eq('user_id', user.id);
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}