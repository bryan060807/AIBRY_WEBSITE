// app/api/generate/route.ts
import { NextResponse } from 'next/server';
import { generateSongDetails } from '../../../lib/aiService';
import { generateSunoSong } from '../../../lib/sunoService';

export async function POST(request: Request) {
  try {
    const { lyrics, genre, style, productionNotes, title: userTitle } = await request.json();

    if (!lyrics || !genre || !style) {
      return NextResponse.json({ error: 'Lyrics, genre, and style are required.' }, { status: 400 });
    }

    // Step 1: Get title and description from Groq
    const songDetails = await generateSongDetails(lyrics, genre, style, productionNotes, userTitle);

    // Step 2: Generate the song with Suno and wait for it to finish
    const audioUrl = await generateSunoSong(lyrics, genre, style, songDetails.title);

    // Step 3: Return the complete, final result to the browser
    return NextResponse.json({
      title: songDetails.title,
      description: songDetails.description,
      audioUrl: audioUrl,
    });

  } catch (error) {
    console.error('Error in generation process:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}