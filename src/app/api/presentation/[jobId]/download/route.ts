import { NextResponse } from 'next/server';

import { EstimatorApiError, downloadProposal, ownsJobId } from '@/lib/estimator';

export const runtime = 'nodejs';
export const maxDuration = 120;

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

    const downloaded = await downloadProposal(jobId);

    if (!downloaded.body) {
      return NextResponse.json({ error: 'Empty download response.' }, { status: 502 });
    }

    const headers = new Headers();
    headers.set('Content-Type', downloaded.contentType);
    headers.set('Content-Disposition', downloaded.contentDisposition ?? 'attachment; filename="estimation.pptx"');

    if (downloaded.contentLength) {
      headers.set('Content-Length', downloaded.contentLength);
    }

    headers.set('Cache-Control', 'no-store');

    return new NextResponse(downloaded.body, {
      status: 200,
      headers
    });
  } catch (error) {
    if (error instanceof EstimatorApiError) {
      console.error(`Estimator API error (${error.status}):`, error.message);
      return NextResponse.json({ error: 'Download failed.' }, { status: mapEstimatorStatus(error.status) });
    }

    console.error('Error downloading presentation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function mapEstimatorStatus(status: number): number {
  if (status === 401 || status === 403) return 502;
  if (status >= 400 && status < 600) return status;
  return 502;
}
