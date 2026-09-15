import { cookies } from 'next/headers';

import { RATE_LIMIT_COOKIE_NAME, RATE_LIMIT_MAX_PER_DAY } from './constants';
import { isJsonObject, parseJsonValue } from './json';

interface RateLimitCookiePayload {
  count: number;
  date: string;
}

export interface RateLimitState {
  allowed: boolean;
  attempts: number;
  date: string;
}

export async function getPresentationRateLimitState(): Promise<RateLimitState> {
  const cookieStore = await cookies();
  const date = new Date().toISOString().split('T')[0] ?? '';
  const raw = cookieStore.get(RATE_LIMIT_COOKIE_NAME)?.value;
  let attempts = 0;

  if (raw) {
    try {
      const parsed = parseJsonValue(raw);
      if (isJsonObject(parsed) && parsed.date === date && typeof parsed.count === 'number') {
        attempts = parsed.count;
      }
    } catch {
      attempts = 0;
    }
  }

  return {
    allowed: attempts < RATE_LIMIT_MAX_PER_DAY,
    attempts,
    date
  };
}

export async function bumpPresentationRateLimit(current: RateLimitState): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(
    RATE_LIMIT_COOKIE_NAME,
    JSON.stringify({ count: current.attempts + 1, date: current.date } satisfies RateLimitCookiePayload),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24
    }
  );
}
