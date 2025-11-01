import { NextResponse } from 'next/server';
import { createServerSideClient } from '@/utils/supabase/server';
import type { Database } from '@/types/supabase';

type Expense = Database['public']['Tables']['expenses']['Row'];

export async function GET() {
  const supabase = createServerSideClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user)
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const supabase = createServerSideClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user)
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );

    const body = await req.json();
    const { description, amount, category } = body;

    if (!description || !amount)
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );

    const { data, error } = await supabase
      .from('expenses')
      .insert([
        {
          user_id: user.id,
          description,
          amount,
          category: category || 'General',
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error creating expense:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}