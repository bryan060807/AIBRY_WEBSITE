// app/api/roast/route.ts
// This is the NEW AI route you needed for adding expenses 

import openai from "@/lib/openaiClient";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { amount, category, guilt, note } = await request.json();
    
    const prompt = `A user just spent $${amount} on "${category}" (guilt level ${guilt}/5). Their note is: "${note}". Write a short, funny, sarcastic roast about this purchase. Keep it to one sentence.`;
    
    const out = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 60,
    });
    
    const roast = out.choices[0].message.content?.trim() || "Wow, great decision.";
    return NextResponse.json({ roast });

  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}