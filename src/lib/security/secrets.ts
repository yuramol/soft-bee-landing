/**
 * Site-wide HMAC secret (cookies: ownership, poll rate, contact rate limit).
 * Prefer SITE_HMAC_SECRET. ESTIMATOR_OWNERSHIP_SECRET is accepted as a temporary alias.
 */
export function getSiteHmacSecret(): string | null {
  const fromEnv = process.env.SITE_HMAC_SECRET?.trim() || process.env.ESTIMATOR_OWNERSHIP_SECRET?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : null;
}

export function isSiteHmacSecretConfigured(): boolean {
  return getSiteHmacSecret() !== null;
}
