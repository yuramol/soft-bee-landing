import {
  CONTACT_RATE_LIMIT_BURST_MAX,
  CONTACT_RATE_LIMIT_BURST_WINDOW_MS,
  CONTACT_RATE_LIMIT_COOKIE_NAME,
  CONTACT_RATE_LIMIT_MAX_PER_DAY
} from './constants';
import { consumeDailyBurstRateLimitSlot, type DailyBurstRateLimitResult } from '@/lib/security/signed-rate-limit';

export type ContactRateLimitState = DailyBurstRateLimitResult;

/** Contact form rate limit — shared daily+burst HMAC cookie helper. */
export async function consumeContactRateLimitSlot(): Promise<ContactRateLimitState> {
  return consumeDailyBurstRateLimitSlot({
    cookieName: CONTACT_RATE_LIMIT_COOKIE_NAME,
    maxPerDay: CONTACT_RATE_LIMIT_MAX_PER_DAY,
    burstMax: CONTACT_RATE_LIMIT_BURST_MAX,
    burstWindowMs: CONTACT_RATE_LIMIT_BURST_WINDOW_MS
  });
}
