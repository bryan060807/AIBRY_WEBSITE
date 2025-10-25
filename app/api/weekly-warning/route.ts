// app/api/weekly-warning/route.ts
// This is the NEW route for the weekly guilt check, based on App.js  and weekly-warning.js

import { supabase } from "@/lib/supabaseClient";
import openai from "@/lib/openaiClient";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Calculate total guilt from the last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
      .from("expenses")
      .select("guilt")
      .gte("created_at", sevenDaysAgo);

    if (error) throw new Error(`Supabase error: ${error.message}`);

    const weeklyGuilt = data.reduce((sum, e) => sum + e.guilt, 0);
    const guiltThreshold = 20; // From your App.js 

    let warning: string | null = null;

    // 2. If guilt is high, get an AI warning
    if (weeklyGuilt >= guiltThreshold) {
      const prompt = `A user has a weekly guilt total of ${weeklyGuilt}, which is over their threshold of ${guiltThreshold}. Write a short, sarcastic, but concerned warning message for them.`;
      
      const out = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Based on your weekly-warning.js (but updated model)
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