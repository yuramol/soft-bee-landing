import { cookies } from 'next/headers';

import { readSignedJsonCookiePayload, signJsonCookiePayload } from './hmac-cookie';
import { getSiteHmacSecret } from './secrets';

export interface DailyBurstRateLimitConfig {
  cookieName: string;
  maxPerDay: number;
  burstMax: number;
  burstWindowMs: number;
}

export interface DailyBurstRateLimitResult {
  allowed: boolean;
  reason?: 'misconfigured' | 'burst' | 'daily';
}

interface DailyBurstPayload {
  v: 1;
  day: string;
  dayCount: number;
  burstTs: number[];
}

/** Calendar-day + sliding burst caps via HMAC cookie. Fail closed if secret missing. */
export async function consumeDailyBurstRateLimitSlot(config: DailyBurstRateLimitConfig): Promise<DailyBurstRateLimitResult> {
  const secret = getSiteHmacSecret();
  if (!secret) {
    return { allowed: false, reason: 'misconfigured' };
  }

  const cookieStore = await cookies();
  const now = Date.now();
  const day = new Date(now).toISOString().slice(0, 10);
  const existing = readDailyBurstPayload(cookieStore.get(config.cookieName)?.value, secret, now, day, config.burstWindowMs);

  if (existing.burstTs.length >= config.burstMax) {
    return { allowed: false, reason: 'burst' };
  }

  if (existing.dayCount >= config.maxPerDay) {
    return { allowed: false, reason: 'daily' };
  }

  const next: DailyBurstPayload = {
    v: 1,
    day,
    dayCount: existing.dayCount + 1,
    burstTs: [...existing.burstTs, now]
  };

  cookieStore.set(config.cookieName, signJsonCookiePayload(next, secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24
  });

  return { allowed: true };
}

export interface SlidingWindowRateLimitConfig {
  cookieName: string;
  maxPerWindow: number;
  windowMs: number;
}

export interface SlidingWindowRateLimitResult {
  allowed: boolean;
  reason?: 'misconfigured';
}

interface SlidingWindowPayload {
  v: 1;
  ts: number[];
}

/** Sliding-window throttle via HMAC cookie. Fail closed if secret missing. */
export async function consumeSlidingWindowRateLimitSlot(config: SlidingWindowRateLimitConfig): Promise<SlidingWindowRateLimitResult> {
  const secret = getSiteHmacSecret();
  if (!secret) {
    return { allowed: false, reason: 'misconfigured' };
  }

  const cookieStore = await cookies();
  const now = Date.now();
  const existing = readSlidingWindowPayload(cookieStore.get(config.cookieName)?.value, secret, now, config.windowMs);

  if (existing.ts.length >= config.maxPerWindow) {
    return { allowed: false };
  }

  const next: SlidingWindowPayload = {
    v: 1,
    ts: [...existing.ts, now]
  };

  cookieStore.set(config.cookieName, signJsonCookiePayload(next, secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: Math.ceil(config.windowMs / 1000)
  });

  return { allowed: true };
}

function readDailyBurstPayload(
  raw: string | undefined,
  secret: string,
  now: number,
  day: string,
  burstWindowMs: number
): DailyBurstPayload {
  const empty: DailyBurstPayload = { v: 1, day, dayCount: 0, burstTs: [] };
  const parsed = readSignedJsonCookiePayload(raw, secret);
  if (!parsed || parsed.v !== 1) {
    return empty;
  }

  const payloadDay = typeof parsed.day === 'string' ? parsed.day : day;
  const dayCount =
    payloadDay === day && typeof parsed.dayCount === 'number' && Number.isFinite(parsed.dayCount)
      ? Math.max(0, Math.floor(parsed.dayCount))
      : 0;

  const windowStart = now - burstWindowMs;
  const burstTs = Array.isArray(parsed.burstTs)
    ? parsed.burstTs.filter((value): value is number => typeof value === 'number' && Number.isFinite(value) && value > windowStart)
    : [];

  return { v: 1, day, dayCount, burstTs };
}

function readSlidingWindowPayload(raw: string | undefined, secret: string, now: number, windowMs: number): SlidingWindowPayload {
  const empty: SlidingWindowPayload = { v: 1, ts: [] };
  const parsed = readSignedJsonCookiePayload(raw, secret);
  if (!parsed || parsed.v !== 1 || !Array.isArray(parsed.ts)) {
    return empty;
  }

  const windowStart = now - windowMs;
  const ts = parsed.ts.filter((value): value is number => typeof value === 'number' && Number.isFinite(value) && value > windowStart);

  return { v: 1, ts };
}
