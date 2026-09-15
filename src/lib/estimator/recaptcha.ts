import { ESTIMATOR_RECAPTCHA_ACTION, RECAPTCHA_MIN_SCORE } from './constants';
import { isJsonObject, readResponseJson } from './json';
import { isAllowedRecaptchaHostname } from './origin';

export interface RecaptchaVerifyResult {
  ok: boolean;
  error?: string;
  score?: number;
}

export async function verifyRecaptchaV3Token(token: string): Promise<RecaptchaVerifyResult> {
  const secret = process.env.RECAPTCHA_SECRET;
  if (!secret) {
    return { ok: false, error: 'Captcha is not configured.' };
  }

  if (!token.trim()) {
    return { ok: false, error: 'Captcha token is required.' };
  }

  const body = new URLSearchParams();
  body.set('secret', secret);
  body.set('response', token);

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    cache: 'no-store'
  });

  if (!response.ok) {
    return { ok: false, error: 'Captcha verification failed.' };
  }

  const payload = await readResponseJson(response);
  if (!isJsonObject(payload) || payload.success !== true) {
    return { ok: false, error: 'Captcha verification failed.' };
  }

  if (typeof payload.action === 'string' && payload.action !== ESTIMATOR_RECAPTCHA_ACTION) {
    return { ok: false, error: 'Captcha action mismatch.' };
  }

  if (typeof payload.hostname !== 'string' || !isAllowedRecaptchaHostname(payload.hostname)) {
    return { ok: false, error: 'Captcha hostname mismatch.' };
  }

  const score = typeof payload.score === 'number' ? payload.score : 0;

  if (score < RECAPTCHA_MIN_SCORE) {
    return { ok: false, error: 'Captcha score too low.', score };
  }

  return { ok: true, score };
}
