import { NextResponse } from 'next/server';

import { EstimatorApiError, consumePresentationPollSlot, getLatestOwnedJobId, getProposal } from '@/lib/estimator';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET() {
  try {
    const jobId = await getLatestOwnedJobId();
    if (!jobId) {
      return NextResponse.json({ active: false });
    }

    const poll = await consumePresentationPollSlot();
    if (!poll.allowed) {
      return NextResponse.json({ error: 'Too many status checks. Please wait a moment.' }, { status: 429 });
    }

    const proposal = await getProposal(jobId);

    return NextResponse.json({
      active: true,
      jobId: proposal.jobId,
      status: proposal.status,
      progress: proposal.progress,
      stage: proposal.stage,
      estimate: proposal.estimate,
      error: proposal.error
    });
  } catch (error) {
    if (error instanceof EstimatorApiError) {
      console.error(`Estimator API error (${error.status}):`, error.message);
      return NextResponse.json({ error: 'Failed to fetch status.' }, { status: mapEstimatorStatus(error.status) });
    }

    console.error('Error fetching active presentation job:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function mapEstimatorStatus(status: number): number {
  if (status === 401 || status === 403) return 502;
  if (status >= 400 && status < 600) return status;
  return 502;
}
