// lib/openaiClient.ts
// Based on your openai.js file

import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ Missing OpenAI API key. Check your environment variables.");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;