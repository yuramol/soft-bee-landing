import { NextResponse } from 'next/server';

import { CONTACT_RECAPTCHA_ACTIONS } from '@/lib/contact/constants';
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
  try {
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

    const ip = getRequestIp(request);
    if (!ip) {
      console.error('Missing client IP for contact rate limit.');
      return NextResponse.json({ error: 'Unable to verify client. Please try again.' }, { status: 503 });
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

    const formData = await request.formData();
    const website = readFormString(formData, 'website');

    // Honeypot: pretend success so scrapers do not learn the trap.
    if (website && website.trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    const kind = readFormString(formData, 'kind');
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

    const sent = await sendContactEmail({
      kind: validation.kind,
      fullName: validation.fullName,
      email: validation.email,
      message: validation.message,
      roleTitle: validation.roleTitle,
      file: validation.file
    });

    if (!sent.ok) {
      return NextResponse.json({ error: sent.error ?? 'Failed to send message.' }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Contact form submission failed:', error);
    return NextResponse.json({ error: 'Unexpected server error.' }, { status: 500 });
  }
}
