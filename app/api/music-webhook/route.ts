// app/api/music-webhook/route.ts
import { NextResponse } from 'next/server';
import { setJob } from '../../../lib/jobStore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("✅ Suno webhook received:", body);

    if (body.msg === 'All generated successfully.' && body.data?.data?.[0]?.audio_url) {
      const finishedClip = body.data.data[0];
      const tempTaskId = finishedClip.title.replace(/\s+/g, '-').toLowerCase();

      setJob(tempTaskId, {
        status: 'completed',
        audio_url: finishedClip.audio_url,
      });
    }
    return NextResponse.json({ status: 'received' });
  } catch (error) {
    console.error("Error in webhook:", error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}