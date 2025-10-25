// app/api/goal-complete/route.ts
// This is the AI route from your index.js

import openai from "@/lib/openaiClient";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { item } = await request.json();
    const prompt = `A user finally reached their goal of buying "${item}". Write a short sarcastic but affectionate message congratulating them.`;
    
    const out = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using the same model
      messages: [{ role: "user", content: prompt }],
      max_tokens: 60,
    });
    
    const message = out.choices[0].message.content?.trim() || "Congrats, I guess.";
    return NextResponse.json({ message });

  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}