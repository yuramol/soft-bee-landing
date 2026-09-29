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
