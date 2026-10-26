const COUNTRY_HEADERS = ['x-vercel-ip-country', 'cf-ipcountry'] as const;
const ALLOW_ALL_COUNTRIES = '*';
/** Cloudflare / Vercel placeholder for "country could not be determined". */
const UNKNOWN_COUNTRY = 'XX';

/**
 * ISO 3166-1 alpha-2 country of the connecting client, as resolved by the hosting edge
 * (Vercel `x-vercel-ip-country`, Cloudflare `cf-ipcountry`). Null when the platform did not provide one.
 * Only trustworthy behind that edge — it overwrites these headers; a bare `next start` does not.
 */
export function getRequestCountry(request: Request): string | null {
  for (const headerName of COUNTRY_HEADERS) {
    const country = normalizeCountry(request.headers.get(headerName));
    if (country) return country;
  }

  return null;
}

/**
 * Countries allowed to submit public forms (`SITE_ALLOWED_COUNTRIES`, comma-separated, e.g. `UA,RO`).
 * Returns null — no restriction — when the variable is unset/empty or `*`.
 * A value with no valid country code yields an empty set (everyone denied) so a typo never silently opens the forms.
 */
export function getAllowedCountries(): Set<string> | null {
  const raw = process.env.SITE_ALLOWED_COUNTRIES?.trim();
  if (!raw || raw === ALLOW_ALL_COUNTRIES) return null;

  const countries = raw
    .split(',')
    .map((value) => normalizeCountry(value))
    .filter((country): country is string => country !== null);

  if (countries.length === 0) {
    console.error(`SITE_ALLOWED_COUNTRIES has no valid ISO 3166-1 alpha-2 codes: "${raw}".`);
  }

  return new Set(countries);
}

function normalizeCountry(value: string | null | undefined): string | null {
  const country = value?.trim().toUpperCase();
  if (!country || country === UNKNOWN_COUNTRY || !/^[A-Z]{2}$/.test(country)) {
    return null;
  }

  return country;
}
