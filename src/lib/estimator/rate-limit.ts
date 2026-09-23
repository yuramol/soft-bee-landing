import { consumeDailyBurstRateLimitSlot, DailyBurstRateLimitResult } from '@/lib/security/signed-rate-limit';

import { RATE_LIMIT_BURST_MAX, RATE_LIMIT_BURST_WINDOW_MS, RATE_LIMIT_COOKIE_NAME, RATE_LIMIT_MAX_PER_DAY } from './constants';

export type RateLimitState = DailyBurstRateLimitResult;

export async function getPresentationRateLimitState(): Promise<RateLimitState> {
  return consumeDailyBurstRateLimitSlot({
    cookieName: RATE_LIMIT_COOKIE_NAME,
    maxPerDay: RATE_LIMIT_MAX_PER_DAY,
    burstMax: RATE_LIMIT_BURST_MAX,
    burstWindowMs: RATE_LIMIT_BURST_WINDOW_MS
  });
}
