import { NextResponse } from 'next/server';
import { createServerSideClient } from '@/utils/supabase/server';
import type { Database } from '@/types/supabase';

type Expense = Database['public']['Tables']['expenses']['Row'];

// GET /api/expenses/[id]
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSideClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user)
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error fetching expense:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/expenses/[id]
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSideClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user)
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { description, amount, category } = body;

    const { data, error } = await supabase
      .from('expenses')
      .update({
        ...(description && { description }),
        ...(amount && { amount }),
        ...(category && { category }),
      })
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error updating expense:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/expenses/[id]
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSideClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user)
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Expense deleted successfully.' });
  } catch (error: any) {
    console.error('Error deleting expense:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}