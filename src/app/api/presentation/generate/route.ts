import { NextResponse } from 'next/server';

import { countEstimationAttemptsByIp, getRequestIp, reserveEstimationAttempt, updateEstimationLog } from '@/lib/api/estimation-logs';
import {
  EstimatorApiError,
  RATE_LIMIT_BURST_MAX,
  RATE_LIMIT_BURST_WINDOW_MS,
  RATE_LIMIT_MAX_PER_DAY,
  createProposal,
  getPresentationRateLimitState,
  isAllowedEstimatorOrigin,
  isOwnershipSecretConfigured,
  rememberOwnedJobId,
  validateEstimatorUploadWithContent,
  verifyRecaptchaV3Token
} from '@/lib/estimator';
import { isBrowserFile, readFormString } from '@/lib/security';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: Request) {
  const ip = getRequestIp(request);
  let requestText: string | null = null;
  let fileName: string | null = null;
  let reservationId: string | null = null;

  try {
    if (!isAllowedEstimatorOrigin(request)) {
      return NextResponse.json({ error: 'Forbidden origin.' }, { status: 403 });
    }

    if (!isOwnershipSecretConfigured()) {
      console.error('SITE_HMAC_SECRET is not configured.');
      return NextResponse.json({ error: 'Server misconfigured.' }, { status: 500 });
    }

    if (!ip) {
      console.error('Missing client IP for estimation rate limit.');
      return NextResponse.json({ error: 'Unable to verify client. Please try again.' }, { status: 503 });
    }

    // Cookie rate limit check (now signed and consumed in one step)
    const rateLimit = await getPresentationRateLimitState();
    if (!rateLimit.allowed) {
      if (rateLimit.reason === 'misconfigured') {
        console.error('SITE_HMAC_SECRET is not configured for presentation rate limit.');
        return NextResponse.json({ error: 'Server misconfigured.' }, { status: 500 });
      }
      if (rateLimit.reason === 'burst') {
        return burstRateLimitResponse();
      }
      return dailyRateLimitResponse();
    }

    const now = Date.now();
    const burstSinceIso = new Date(now - RATE_LIMIT_BURST_WINDOW_MS).toISOString();
    const daySinceIso = new Date(now - 24 * 60 * 60 * 1000).toISOString();

    const burstBlocked = await isIpOverLimit(ip, burstSinceIso, RATE_LIMIT_BURST_MAX, 'pre');
    if (burstBlocked === 'unavailable') {
      return rateLimitUnavailableResponse();
    }
    if (burstBlocked === 'exceeded') {
      return burstRateLimitResponse();
    }

    const dayBlocked = await isIpOverLimit(ip, daySinceIso, RATE_LIMIT_MAX_PER_DAY, 'pre');
    if (dayBlocked === 'unavailable') {
      return rateLimitUnavailableResponse();
    }
    if (dayBlocked === 'exceeded') {
      return dailyRateLimitResponse();
    }

    const formData = await request.formData();
    const text = readFormString(formData, 'text');
    const fileEntry = formData.get('file');
    const file = isBrowserFile(fileEntry) ? fileEntry : null;
    const captchaToken = readFormString(formData, 'captchaToken') ?? readFormString(formData, 'recaptchaToken');

    requestText = text?.trim() || null;
    fileName = file?.name ?? null;

    // Reserve quota before captcha / validation / Railway so junk captcha spam still counts.
    reservationId = await reserveEstimationAttempt({
      jobId: null,
      status: 'queued',
      requestText,
      fileName,
      errorMessage: null,
      ip
    });
    if (!reservationId) {
      return rateLimitUnavailableResponse();
    }

    const burstAfter = await isIpOverLimit(ip, burstSinceIso, RATE_LIMIT_BURST_MAX, 'post');
    if (burstAfter === 'unavailable') {
      await markReservationFailed(reservationId, requestText, fileName, 'rate_limit_unavailable');
      return rateLimitUnavailableResponse();
    }
    if (burstAfter === 'exceeded') {
      await markReservationFailed(reservationId, requestText, fileName, 'burst_rate_limit_exceeded');
      return burstRateLimitResponse();
    }

    const dayAfter = await isIpOverLimit(ip, daySinceIso, RATE_LIMIT_MAX_PER_DAY, 'post');
    if (dayAfter === 'unavailable') {
      await markReservationFailed(reservationId, requestText, fileName, 'rate_limit_unavailable');
      return rateLimitUnavailableResponse();
    }
    if (dayAfter === 'exceeded') {
      await markReservationFailed(reservationId, requestText, fileName, 'rate_limit_exceeded');
      return dailyRateLimitResponse();
    }

    const captchaResult = await verifyRecaptchaV3Token(captchaToken ?? '');
    if (!captchaResult.ok) {
      await markReservationFailed(reservationId, requestText, fileName, captchaResult.error ?? 'Captcha verification failed.');
      return NextResponse.json({ error: captchaResult.error ?? 'Captcha verification failed.' }, { status: 403 });
    }

    const validation = await validateEstimatorUploadWithContent({ text, file });
    if (!validation.ok) {
      await markReservationFailed(reservationId, requestText, fileName, validation.error);
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const idempotencyKey = request.headers.get('Idempotency-Key') ?? undefined;

    const created = await createProposal({
      projectText: text ?? undefined,
      file: file ?? undefined,
      fileName: file?.name,
      idempotencyKey
    });

    await rememberOwnedJobId(created.jobId);
    await updateEstimationLog({
      id: reservationId,
      jobId: created.jobId,
      status: 'queued',
      requestText,
      fileName,
      errorMessage: null
    });

    return NextResponse.json(
      {
        jobId: created.jobId,
        status: created.status
      },
      { status: 200 }
    );
  } catch (error) {
    if (reservationId) {
      const message = error instanceof EstimatorApiError ? error.message : 'Internal server error';
      await markReservationFailed(reservationId, requestText, fileName, message);
    }

    if (error instanceof EstimatorApiError) {
      console.error(`Estimator API error (${error.status}):`, error.message);
      return NextResponse.json({ error: 'Generation failed.' }, { status: mapEstimatorStatus(error.status) });
    }

    console.error('Error generating presentation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

type IpLimitPhase = 'pre' | 'post';
type IpLimitResult = 'ok' | 'exceeded' | 'unavailable';

async function isIpOverLimit(ip: string, sinceIso: string, max: number, phase: IpLimitPhase): Promise<IpLimitResult> {
  const attempts = await countEstimationAttemptsByIp(ip, sinceIso);
  if (attempts === null) {
    return 'unavailable';
  }

  // pre: block when already at max; post-reserve: block when count went past max
  if (phase === 'pre' ? attempts >= max : attempts > max) {
    return 'exceeded';
  }

  return 'ok';
}

async function markReservationFailed(
  reservationId: string,
  requestText: string | null,
  fileName: string | null,
  errorMessage: string
): Promise<void> {
  await updateEstimationLog({
    id: reservationId,
    status: 'failed',
    requestText,
    fileName,
    errorMessage
  });
}

function burstRateLimitResponse(): NextResponse {
  return NextResponse.json(
    {
      error: `Too many requests. Limit is ${RATE_LIMIT_BURST_MAX} every 10 minutes. Please try again shortly.`
    },
    { status: 429 }
  );
}

function dailyRateLimitResponse(): NextResponse {
  return NextResponse.json(
    { error: `You have reached the limit of ${RATE_LIMIT_MAX_PER_DAY} requests per day. Please try again tomorrow.` },
    { status: 429 }
  );
}

function rateLimitUnavailableResponse(): NextResponse {
  return NextResponse.json({ error: 'Rate limit temporarily unavailable. Please try again.' }, { status: 503 });
}

function mapEstimatorStatus(status: number): number {
  if (status === 401 || status === 403) return 502;
  if (status >= 400 && status < 600) return status;
  return 502;
}
