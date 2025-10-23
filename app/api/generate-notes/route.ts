// app/api/generate-notes/route.ts
import { NextResponse } from 'next/server';
import { generateProductionNotes } from '../../../lib/aiService';

export async function POST(request: Request) {
  try {
    const { lyrics, genre, style } = await request.json();

    if (!lyrics || !genre || !style) {
      return NextResponse.json({ error: 'Lyrics, genre, and style are required' }, { status: 400 });
    }

    const notes = await generateProductionNotes(lyrics, genre, style);

    return NextResponse.json({ notes });

  } catch (error) {
    console.error('Error generating production notes:', error);
    return NextResponse.json({ error: 'Failed to generate production notes' }, { status: 500 });
  }
}