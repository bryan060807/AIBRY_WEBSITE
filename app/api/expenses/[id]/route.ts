// app/api/expenses/[id]/route.ts

import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";
import { createServerSideClient } from '@/utils/supabase/server'; // Import server client

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Get the logged-in user
  const supabaseServer = await createServerSideClient();
  const { data: { user } } = await supabaseServer.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Delete the expense *only if* the user_id matches
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq('user_id', user.id) // <-- Security check
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}