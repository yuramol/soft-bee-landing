import { describe, expect, it } from 'vitest';

import { parseRetryAfterMs } from './client';

describe('parseRetryAfterMs', () => {
  it('parses integer seconds', () => {
    const response = new Response(null, { headers: { 'Retry-After': '5' } });
    expect(parseRetryAfterMs(response)).toBe(5000);
  });

  it('returns null when header missing', () => {
    expect(parseRetryAfterMs(new Response(null))).toBeNull();
  });

  it('parses HTTP-date in the future', () => {
    const when = new Date(Date.now() + 10_000).toUTCString();
    const response = new Response(null, { headers: { 'Retry-After': when } });
    const ms = parseRetryAfterMs(response);
    expect(ms).not.toBeNull();
    expect(ms!).toBeGreaterThan(0);
    expect(ms!).toBeLessThanOrEqual(10_000);
  });
});
