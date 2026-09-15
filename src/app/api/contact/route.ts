import { NextResponse } from 'next/server';

import { countContactAttemptsByIp, reserveContactSubmission, updateContactLog } from '@/lib/api/contact-logs';
import { CONTACT_RATE_LIMIT_BURST_MAX, CONTACT_RATE_LIMIT_BURST_WINDOW_MS, CONTACT_RATE_LIMIT_MAX_PER_DAY, CONTACT_RECAPTCHA_ACTIONS } from '@/lib/contact/constants';
import { consumeContactRateLimitSlot } from '@/lib/contact/rate-limit';
import { isContactMailConfigured } from '@/lib/contact/secrets';
import { sendContactEmail } from '@/lib/contact/send';
import { validateContactSubmissionWithContent } from '@/lib/contact/validate';
import { verifyRecaptchaV3Token } from '@/lib/estimator/recaptcha';
import {
  getRequestIp,
  isAllowedRecaptchaHostname,
  isAllowedRequestOrigin,
  isBrowserFile,
  isSiteHmacSecretConfigured,
  readFormString
} from '@/lib/security';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(request: Request) {
  let reservationId: string | null = null;
  let contactKind: string | null = null;

  try {
    // 1. Origin / config checks
    if (!isAllowedRequestOrigin(request)) {
      return NextResponse.json({ error: 'Forbidden origin.' }, { status: 403 });
    }

    if (!isContactMailConfigured()) {
      console.error('RESEND_API_KEY is not configured.');
      return NextResponse.json({ error: 'Server misconfigured.' }, { status: 500 });
    }

    if (!isSiteHmacSecretConfigured()) {
      console.error('SITE_HMAC_SECRET is not configured.');
      return NextResponse.json({ error: 'Server misconfigured.' }, { status: 500 });
    }

    // 2. Parse form → honeypot check WITHOUT consuming quota
    const formData = await request.formData();
    const website = readFormString(formData, 'website');

    if (website && website.trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    // 3. IP + cookie rate limits (resolve IP fail-closed; check IP burst+daily; then consume cookie slot)
    const ip = getRequestIp(request);
    if (!ip) {
      console.error('Missing client IP for contact rate limit.');
      return NextResponse.json({ error: 'Unable to verify client. Please try again.' }, { status: 503 });
    }

    const now = Date.now();
    const burstSinceIso = new Date(now - CONTACT_RATE_LIMIT_BURST_WINDOW_MS).toISOString();
    const daySinceIso = new Date(now - 24 * 60 * 60 * 1000).toISOString();

    const burstBlocked = await isIpOverLimit(ip, burstSinceIso, CONTACT_RATE_LIMIT_BURST_MAX);
    if (burstBlocked === 'unavailable') {
      return rateLimitUnavailableResponse();
    }
    if (burstBlocked === 'exceeded') {
      return burstRateLimitResponse();
    }

    const dayBlocked = await isIpOverLimit(ip, daySinceIso, CONTACT_RATE_LIMIT_MAX_PER_DAY);
    if (dayBlocked === 'unavailable') {
      return rateLimitUnavailableResponse();
    }
    if (dayBlocked === 'exceeded') {
      return dailyRateLimitResponse();
    }

    const rateLimit = await consumeContactRateLimitSlot();
    if (!rateLimit.allowed) {
      if (rateLimit.reason === 'misconfigured') {
        console.error('Contact rate-limit secret is not configured.');
        return NextResponse.json({ error: 'Server misconfigured.' }, { status: 500 });
      }

      return NextResponse.json(
        { error: 'Too many messages. Please try again later.' },
        { status: 429, headers: { 'Retry-After': '3600' } }
      );
    }

    // 4. Validate + captcha
    const kind = readFormString(formData, 'kind');
    contactKind = kind;
    const fileEntry = formData.get('file');
    const file = isBrowserFile(fileEntry) ? fileEntry : null;

    const validation = await validateContactSubmissionWithContent({
      kind,
      fullName: readFormString(formData, 'fullName'),
      email: readFormString(formData, 'email'),
      message: readFormString(formData, 'message'),
      roleTitle: readFormString(formData, 'roleTitle'),
      file,
      website: null
    });

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const captchaToken = readFormString(formData, 'captchaToken') ?? readFormString(formData, 'recaptchaToken');
    const expectedAction = CONTACT_RECAPTCHA_ACTIONS[validation.kind];
    const captchaResult = await verifyRecaptchaV3Token(captchaToken ?? '', {
      expectedAction,
      isAllowedHostname: isAllowedRecaptchaHostname
    });

    if (!captchaResult.ok) {
      return NextResponse.json({ error: captchaResult.error ?? 'Captcha verification failed.' }, { status: 403 });
    }

    // 5. Send (and log successful submission)
    const sent = await sendContactEmail({
      kind: validation.kind,
      fullName: validation.fullName,
      email: validation.email,
      message: validation.message,
      roleTitle: validation.roleTitle,
      file: validation.file
    });

    if (!sent.ok) {
      await logFailedSubmission(validation.kind, ip, sent.error ?? 'Email send failed.');
      return NextResponse.json({ error: 'Failed to send message.' }, { status: 502 });
    }

    reservationId = await reserveContactSubmission({
      kind: validation.kind,
      status: 'sent',
      ip
    });

    if (!reservationId) {
      console.warn('Contact submitted successfully but failed to log submission for IP tracking.');
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Contact form submission failed:', error);

    if (contactKind) {
      const ip = getRequestIp(request);
      if (ip) {
        await logFailedSubmission(contactKind as any, ip, 'Unexpected server error.');
      }
    }

    return NextResponse.json({ error: 'Unexpected server error.' }, { status: 500 });
  }
}

type IpLimitResult = 'ok' | 'exceeded' | 'unavailable';

async function isIpOverLimit(ip: string, sinceIso: string, max: number): Promise<IpLimitResult> {
  const attempts = await countContactAttemptsByIp(ip, sinceIso);
  if (attempts === null) {
    return 'unavailable';
  }

  if (attempts >= max) {
    return 'exceeded';
  }

  return 'ok';
}

async function logFailedSubmission(kind: string, ip: string, errorMessage: string): Promise<void> {
  await reserveContactSubmission({
    kind: kind as any,
    status: 'failed',
    ip,
    errorMessage
  });
}

function burstRateLimitResponse(): NextResponse {
  return NextResponse.json(
    {
      error: `Too many messages. Limit is ${CONTACT_RATE_LIMIT_BURST_MAX} every 10 minutes. Please try again shortly.`
    },
    { status: 429 }
  );
}

function dailyRateLimitResponse(): NextResponse {
  return NextResponse.json(
    { error: `You have reached the limit of ${CONTACT_RATE_LIMIT_MAX_PER_DAY} messages per day. Please try again tomorrow.` },
    { status: 429, headers: { 'Retry-After': '86400' } }
  );
}

function rateLimitUnavailableResponse(): NextResponse {
  return NextResponse.json({ error: 'Rate limit temporarily unavailable. Please try again.' }, { status: 503 });
}
