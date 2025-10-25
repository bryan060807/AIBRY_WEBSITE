// app/api/goals/[id]/route.ts

import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";
import { createServerSideClient } from '@/utils/supabase/server'; // Import server client

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { earned } = await request.json();

  // Get the logged-in user
  const supabaseServer = await createServerSideClient();
  const { data: { user } } = await supabaseServer.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (typeof earned !== "number") {
    return NextResponse.json({ error: "Invalid 'earned' amount" }, { status: 400 });
  }

  // Update the goal *only if* the user_id matches
  const { error } = await supabase
    .from("goals")
    .update({ earned })
    .eq('user_id', user.id) // <-- Security check
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

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

  // Delete the goal *only if* the user_id matches
  const { error } = await supabase
    .from("goals")
    .delete()
    .eq('user_id', user.id) // <-- Security check
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}