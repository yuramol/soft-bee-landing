import { POLL_RATE_COOKIE_NAME, POLL_RATE_MAX_PER_WINDOW, POLL_RATE_WINDOW_MS } from './constants';
import { consumeSlidingWindowRateLimitSlot } from '@/lib/security/signed-rate-limit';

export interface PollRateResult {
  allowed: boolean;
}

/** Sliding-window poll throttle (HMAC cookie). Fail closed if ownership secret missing. */
export async function consumePresentationPollSlot(): Promise<PollRateResult> {
  const result = await consumeSlidingWindowRateLimitSlot({
    cookieName: POLL_RATE_COOKIE_NAME,
    maxPerWindow: POLL_RATE_MAX_PER_WINDOW,
    windowMs: POLL_RATE_WINDOW_MS
  });

  return { allowed: result.allowed };
}
