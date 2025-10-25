// app/api/weekly-warning/route.ts

import { supabase } from "@/lib/supabaseClient";
import openai from "@/lib/openaiClient";
import { NextResponse } from "next/server";
import { createServerSideClient } from '@/utils/supabase/server'; // Import server client

export async function GET() {
  // Get the logged-in user
  const supabaseServer = await createServerSideClient();
  const { data: { user } } = await supabaseServer.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Calculate total guilt from the last 7 days *for this user*
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
      .from("expenses")
      .select("guilt")
      .eq('user_id', user.id) // <-- Only get expenses for this user
      .gte("created_at", sevenDaysAgo);

    if (error) throw new Error(`Supabase error: ${error.message}`);

    const weeklyGuilt = data.reduce((sum, e) => sum + e.guilt, 0);
    const guiltThreshold = 20; // From your App.js

    let warning: string | null = null;

    // 2. If guilt is high, get an AI warning
    if (weeklyGuilt >= guiltThreshold) {
      const prompt = `A user has a weekly guilt total of ${weeklyGuilt}, which is over their threshold of ${guiltThreshold}. Write a short, sarcastic, but concerned warning message for them.`;
      
      const out = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 60,
      });
      warning = out.choices[0].message.content?.trim() || "You should probably calm down.";
    }

    return NextResponse.json({ weeklyGuilt, warning });

  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}