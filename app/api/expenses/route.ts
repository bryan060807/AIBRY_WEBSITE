// app/api/expenses/route.ts
// Handles GET /expenses and POST /expenses

import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET() {
  // Get all expenses
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  // Add a new expense
  const { amount, category, guilt, note } = await request.json();

  const { data, error } = await supabase
    .from("expenses")
    .insert([{ amount, category, guilt, note }])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ? data[0] : {});
}