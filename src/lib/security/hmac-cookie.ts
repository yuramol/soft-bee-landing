import { createHmac, timingSafeEqual } from 'crypto';

import { isJsonObject, parseJsonValue, type JsonObject } from './json';

/** HMAC-SHA256 over base64url(JSON). Format: `{body}.{signature}`. */
export function signJsonCookiePayload(payload: object, secret: string): string {
  const body = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const signature = createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${signature}`;
}

/** Verify signature and parse JSON object body. Returns null if invalid. */
export function readSignedJsonCookiePayload(raw: string | undefined, secret: string): JsonObject | null {
  if (!raw) {
    return null;
  }

  const separatorIndex = raw.lastIndexOf('.');
  if (separatorIndex <= 0 || separatorIndex === raw.length - 1) {
    return null;
  }

  const body = raw.slice(0, separatorIndex);
  const signature = raw.slice(separatorIndex + 1);
  const expected = createHmac('sha256', secret).update(body).digest('base64url');
  if (!safeEqualBase64Url(signature, expected)) {
    return null;
  }

  try {
    const parsed = parseJsonValue(Buffer.from(body, 'base64url').toString('utf8'));
    if (!isJsonObject(parsed)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function safeEqualBase64Url(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}
