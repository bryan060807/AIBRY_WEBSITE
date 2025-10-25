// app/api/goals/[id]/route.ts
// Handles PATCH /goals/:id and DELETE /goals/:id

import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Update a goal's 'earned' amount
  const { id } = params;
  const { earned } = await request.json();

  if (typeof earned !== "number") {
    return NextResponse.json({ error: "Invalid 'earned' amount" }, { status: 400 });
  }

  const { error } = await supabase
    .from("goals")
    .update({ earned })
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
  // Delete a goal
  const { id } = params;

  const { error } = await supabase.from("goals").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}