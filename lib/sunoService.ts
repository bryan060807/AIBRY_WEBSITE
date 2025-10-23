// lib/sunoService.ts

const SUNO_API_URL = 'https://api.sunoapi.org/api/v1';
const SUNO_API_KEY = process.env.SUNO_API_KEY!;

interface SunoGenerationResponse {
  code: number;
  msg: string;
  data: {
    task_id: string;
  };
}

// Function to start the song generation
async function startSunoGeneration(lyrics: string, genre: string, style: string, title: string): Promise<string> {
  const response = await fetch(`${SUNO_API_URL}/generate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUNO_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customMode: true,
      prompt: lyrics,
      style: `${genre}, ${style}`,
      title: title,
      instrumental: false,
      model: 'V5', // The specific model version
      callBackUrl: 'https://stressedly-undainty-armani.ngrok-free.dev/api/music-webhook',
    }),
  });

  if (!response.ok) {
    throw new Error(`Suno API failed to start task: ${await response.text()}`);
  }
  
  const result: SunoGenerationResponse = await response.json();
  if (result.code !== 200) {
      throw new Error(`Suno API returned an error: ${result.msg}`);
  }

  return result.data.task_id;
}

// Function to check the status of the generation
async function checkSunoStatus(taskId: string) {
  const response = await fetch(`${SUNO_API_URL}/generate/record-info?task_id=${taskId}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${SUNO_API_KEY}` },
  });

  if (!response.ok) {
    throw new Error(`Suno API failed to check status: ${await response.text()}`);
  }

  return response.json();
}

// Main function that orchestrates the process
export async function generateSunoSong(
  lyrics: string,
  genre: string,
  style: string,
  title: string
): Promise<string> {
  
  const taskId = await startSunoGeneration(lyrics, genre, style, title);
  console.log("Started Suno generation with Task ID:", taskId);

  // Poll for the result until one of the songs is complete
  for (let i = 0; i < 90; i++) { // Poll for up to 3 minutes
    await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2 seconds
    
    const statusResponse = await checkSunoStatus(taskId);
    console.log("Checking Suno status:", statusResponse.data?.status);

    if (statusResponse.data?.status === 'SUCCESS') {
       const finishedClip = statusResponse.data.tracks.find((track: any) => track.audio_url);
       if(finishedClip) {
           console.log("Suno generation finished:", finishedClip);
           return finishedClip.audio_url;
       }
    } else if (statusResponse.data?.status === 'GENERATE_AUDIO_FAILED' || statusResponse.data?.status === 'CREATE_TASK_FAILED') {
        throw new Error(`Suno generation failed with status: ${statusResponse.data.status}`);
    }
  }

  throw new Error('Suno generation timed out.');
}