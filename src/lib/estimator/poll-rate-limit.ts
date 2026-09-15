import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

import {
  POLL_RATE_COOKIE_NAME,
  POLL_RATE_MAX_PER_WINDOW,
  POLL_RATE_WINDOW_MS
} from './constants';
import { isJsonObject, parseJsonValue } from './json';
import { getOwnershipSecret } from './secrets';

interface PollRatePayload {
  v: 1;
  ts: number[];
}

export interface PollRateResult {
  allowed: boolean;
}

/** Sliding-window poll throttle (HMAC cookie). Fail closed if ownership secret missing. */
export async function consumePresentationPollSlot(): Promise<PollRateResult> {
  const secret = getOwnershipSecret();
  if (!secret) {
    return { allowed: false };
  }

  const cookieStore = await cookies();
  const now = Date.now();
  const existing = readPollRatePayload(cookieStore.get(POLL_RATE_COOKIE_NAME)?.value, secret, now);

  if (existing.ts.length >= POLL_RATE_MAX_PER_WINDOW) {
    return { allowed: false };
  }

  const next: PollRatePayload = {
    v: 1,
    ts: [...existing.ts, now]
  };

  cookieStore.set(POLL_RATE_COOKIE_NAME, signPollRatePayload(next, secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: Math.ceil(POLL_RATE_WINDOW_MS / 1000)
  });

  return { allowed: true };
}

function signPollRatePayload(payload: PollRatePayload, secret: string): string {
  const body = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const signature = createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${signature}`;
}

function readPollRatePayload(raw: string | undefined, secret: string, now: number): PollRatePayload {
  if (!raw) {
    return { v: 1, ts: [] };
  }

  const separatorIndex = raw.lastIndexOf('.');
  if (separatorIndex <= 0 || separatorIndex === raw.length - 1) {
    return { v: 1, ts: [] };
  }

  const body = raw.slice(0, separatorIndex);
  const signature = raw.slice(separatorIndex + 1);
  const expected = createHmac('sha256', secret).update(body).digest('base64url');
  if (!safeEqualBase64Url(signature, expected)) {
    return { v: 1, ts: [] };
  }

  try {
    const parsed = parseJsonValue(Buffer.from(body, 'base64url').toString('utf8'));
    if (!isJsonObject(parsed) || parsed.v !== 1 || !Array.isArray(parsed.ts)) {
      return { v: 1, ts: [] };
    }

    const windowStart = now - POLL_RATE_WINDOW_MS;
    const ts = parsed.ts.filter(
      (value): value is number => typeof value === 'number' && Number.isFinite(value) && value > windowStart
    );

    return { v: 1, ts };
  } catch {
    return { v: 1, ts: [] };
  }
}

function safeEqualBase64Url(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}
