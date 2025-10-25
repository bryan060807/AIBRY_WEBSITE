// app/api/goals/route.ts

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

  // Get all goals *for that user*
  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq('user_id', user.id) // <-- Only get goals for this user
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

  // Add a new goal
  const { item, cost } = await request.json();

  const { data, error } = await supabase
    .from("goals")
    .insert([{ item, cost, earned: 0, user_id: user.id }]) // <-- Stamp with user's ID
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ? data[0] : {});
}