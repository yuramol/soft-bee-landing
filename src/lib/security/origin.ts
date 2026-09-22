/**
 * Origin allowlist for public browser POSTs (`SITE_ALLOWED_ORIGINS`).
 * Shared by Smart Estimation and contact forms.
 * ESTIMATOR_ALLOWED_ORIGINS is accepted as a temporary alias.
 */
export function isAllowedRequestOrigin(request: Request): boolean {
  const originHeader = request.headers.get('origin');

  // Production: require Origin (do not accept Referer-only — trivial to forge).
  if (process.env.NODE_ENV !== 'development') {
    if (!originHeader) {
      return false;
    }

    const allowlist = parseAllowedOrigins(resolveAllowedOriginsRaw());
    return allowlist.includes(normalizeOrigin(originHeader));
  }

  const referer = request.headers.get('referer');
  const candidate = originHeader ?? extractOriginFromReferer(referer);

  if (!candidate) {
    return false;
  }

  if (isLocalhostOrigin(candidate)) {
    return true;
  }

  const allowlist = parseAllowedOrigins(resolveAllowedOriginsRaw());
  return allowlist.includes(normalizeOrigin(candidate));
}

/** @deprecated Prefer isAllowedRequestOrigin — same allowlist. */
export function isAllowedEstimatorOrigin(request: Request): boolean {
  return isAllowedRequestOrigin(request);
}

/** Hostnames accepted for reCAPTCHA siteverify `hostname` (no scheme/port). */
export function getAllowedRecaptchaHostnames(): Set<string> {
  const hostnames = new Set<string>();

  if (process.env.NODE_ENV === 'development') {
    hostnames.add('localhost');
    hostnames.add('127.0.0.1');
  }

  for (const origin of parseAllowedOrigins(resolveAllowedOriginsRaw())) {
    try {
      hostnames.add(new URL(origin).hostname.toLowerCase());
    } catch {
      // skip invalid entries
    }
  }

  return hostnames;
}

export function isAllowedRecaptchaHostname(hostname: string): boolean {
  const normalized = hostname.trim().toLowerCase();
  if (!normalized) {
    return false;
  }

  return getAllowedRecaptchaHostnames().has(normalized);
}

function resolveAllowedOriginsRaw(): string | undefined {
  const primary = process.env.SITE_ALLOWED_ORIGINS?.trim();
  if (primary) return primary;
  return process.env.ESTIMATOR_ALLOWED_ORIGINS;
}

function parseAllowedOrigins(raw: string | undefined): string[] {
  if (!raw) return [];

  return raw
    .split(',')
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
    .map(normalizeOrigin);
}

function extractOriginFromReferer(referer: string | null): string | null {
  if (!referer) return null;

  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
}

function isLocalhostOrigin(origin: string): boolean {
  try {
    const { hostname } = new URL(origin);
    return hostname === 'localhost' || hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

function normalizeOrigin(origin: string): string {
  return origin.replace(/\/$/, '');
}
