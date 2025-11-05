// lib/aiService.ts
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const model = 'llama-3.1-8b-instant';

interface SongDetailsResponse {
  title: string;
  description: string;
}

export async function generateSongDetails(
  lyrics: string,
  genre: string,
  style: string,
  productionNotes: string,
  userTitle?: string
): Promise<SongDetailsResponse> {
  const prompt = `
    You are a creative director for a new song. Based on the following details, generate:
    1. A compelling song title (if one isn't provided).
    2. A short, evocative description for the song (one sentence).

    Details:
    - Lyrics: "${lyrics}"
    - Genre: "${genre}"
    - Style: "${style}"
    ${userTitle ? `- Provided Title: "${userTitle}" (Use this exact title)` : ''}
    ${productionNotes ? `- Production Notes: "${productionNotes}"` : ''}

    Return ONLY a valid, single JSON object with the keys: "title" and "description". Do not include any other text, just the JSON object.
  `;

  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: model,
    temperature: 1,
    max_tokens: 1024,
    top_p: 1,
    stream: false,
    response_format: { type: 'json_object' },
  });

  const responseText = chatCompletion.choices[0].message.content!;
  const parsedResponse = JSON.parse(responseText);

  if (userTitle) {
    parsedResponse.title = userTitle;
  }
  
  return parsedResponse;
}

export async function generateProductionNotes(
  lyrics: string,
  genre: string,
  style: string
): Promise<string> {
  const prompt = `You are an experienced music producer. Based on the provided lyrics, genre, and style, generate a concise, comma-separated list of production notes. These notes should suggest instrumentation, arrangement ideas, and mixing techniques to achieve the desired sound. Do not suggest vocal effects.

  Lyrics:
  ${lyrics}

  Genre: ${genre}
  Style: ${style}

  Provide a few creative and technical suggestions as a single comma-separated string. Example: "Driving 808 bass, ethereal synth pads, crisp hi-hats, side-chained compression on the kick".
  `;

  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: model,
  });

  return chatCompletion.choices[0].message.content!;
}