// app/api/expenses/route.ts

import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";
import { createServerSideClient } from '@/utils/supabase/server'; // Import server client

export async function GET() {
  // Get the logged-in user
  const supabaseServer = await createServerSideClient();
  const { data: { user } } = await supabaseServer.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get all expenses *for that user*
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq('user_id', user.id) // <-- Only get expenses for this user
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  // Get the logged-in user
  const supabaseServer = await createServerSideClient();
  const { data: { user } } = await supabaseServer.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Add a new expense
  const { amount, category, guilt, note } = await request.json();

  const { data, error } = await supabase
    .from("expenses")
    .insert([{ amount, category, guilt, note, user_id: user.id }]) // <-- Stamp with user's ID
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ? data[0] : {});
}