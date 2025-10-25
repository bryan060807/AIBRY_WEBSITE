// app/api/goals/route.ts
// Handles GET /goals and POST /goals

import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET() {
  // Get all goals
  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  // Add a new goal
  const { item, cost } = await request.json();

  const { data, error } = await supabase
    .from("goals")
    .insert([{ item, cost, earned: 0 }]) // Set default earned
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ? data[0] : {});
}