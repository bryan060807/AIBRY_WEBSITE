// app/api/generate/route.ts
import { NextResponse } from 'next/server';
import { generateSongDetails } from '../../../lib/aiService';
import { generateSunoSong } from '../../../lib/sunoService';
import { createServerSideClient } from '@/utils/supabase/server'; // <-- ADDED

export async function POST(request: Request) {
  // --- NEW SECURITY CHECK ---
  const supabaseServer = await createServerSideClient();
  const { data: { user } } = await supabaseServer.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // --- END SECURITY CHECK ---

  try {
    const { lyrics, genre, style, productionNotes, userTitle } = await request.json();

    if (!lyrics || !genre || !style) {
      return NextResponse.json({ error: 'Lyrics, genre, and style are required.' }, { status: 400 });
    }

    // Step 1: Get title and description from Groq
    const songDetails = await generateSongDetails(lyrics, genre, style, productionNotes, userTitle);

    // Step 2: Generate the song with Suno and wait for it to finish
    // We pass the user.id to the Suno service in case it's needed for logging/storage
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