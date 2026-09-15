import { NextResponse } from 'next/server';

import { finalizeEstimationLog } from '@/lib/api/estimation-logs';
import { EstimatorApiError, consumePresentationPollSlot, getProposal, ownsJobId } from '@/lib/estimator';

export const runtime = 'nodejs';
export const maxDuration = 60;

interface RouteContext {
  params: Promise<{
    jobId: string;
  }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { jobId } = await context.params;

    if (!jobId) {
      return NextResponse.json({ error: 'Job id is required.' }, { status: 400 });
    }

    if (!(await ownsJobId(jobId))) {
      return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    }

    const poll = await consumePresentationPollSlot();
    if (!poll.allowed) {
      return NextResponse.json({ error: 'Too many status checks. Please wait a moment.' }, { status: 429 });
    }

    const proposal = await getProposal(jobId);

    if (proposal.status === 'completed' || proposal.status === 'failed') {
      await finalizeEstimationLog({
        jobId: proposal.jobId,
        status: proposal.status,
        errorMessage: proposal.error ?? null
      });
    }

    return NextResponse.json({
      jobId: proposal.jobId,
      status: proposal.status,
      progress: proposal.progress,
      stage: proposal.stage,
      estimate: proposal.estimate,
      error: proposal.error
    });
  } catch (error) {
    if (error instanceof EstimatorApiError) {
      return NextResponse.json({ error: error.message }, { status: mapEstimatorStatus(error.status) });
    }

    console.error('Error fetching presentation status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function mapEstimatorStatus(status: number): number {
  if (status === 401 || status === 403) return 502;
  if (status >= 400 && status < 600) return status;
  return 502;
}
