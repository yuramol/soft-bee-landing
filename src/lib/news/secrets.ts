/**
 * Server-only Soft Bee News credentials.
 */
export function getNewsServiceUrl(): string | null {
  const baseUrl = process.env.NEWS_SERVICE_URL?.trim().replace(/\/$/, '');
  return baseUrl && baseUrl.length > 0 ? baseUrl : null;
}

export function getNewsApiKey(): string | null {
  const key = process.env.NEWS_API_KEY?.trim();
  return key && key.length > 0 ? key : null;
}

export function isNewsConfigured(): boolean {
  return Boolean(getNewsServiceUrl() && getNewsApiKey());
}

/**
 * Secret for `POST /api/insights/refresh` (Vercel Cron / manual ops).
 * Prefer NEWS_REFRESH_SECRET; fall back to CRON_SECRET.
 */
export function getNewsRefreshSecret(): string | null {
  const dedicated = process.env.NEWS_REFRESH_SECRET?.trim();
  if (dedicated) return dedicated;

  const cron = process.env.CRON_SECRET?.trim();
  return cron && cron.length > 0 ? cron : null;
}
