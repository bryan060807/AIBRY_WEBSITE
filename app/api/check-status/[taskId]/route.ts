// app/api/check-status/[taskId]/route.ts
import { NextResponse } from 'next/server';
import { getJob } from '../../../../lib/jobStore';

export async function GET(request: Request, { params }: { params: { taskId: string } }) {
  const job = getJob(params.taskId);
  if (job?.status === 'completed') {
    return NextResponse.json({ status: 'completed', data: job });
  } else {
    return NextResponse.json({ status: 'pending' });
  }
}