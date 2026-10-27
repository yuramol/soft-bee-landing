import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { getContactToAddress } from '@/lib/contact/secrets';

import { readSignedJsonCookiePayload, signJsonCookiePayload } from './hmac-cookie';
import { getAllowedCountries, getRequestCountry } from './request-country';
import { getRequestIp } from './request-ip';
import { getSiteHmacSecret } from './secrets';
import { consumeSlidingWindowRateLimitSlot } from './signed-rate-limit';

export const GEO_VISIT_COOKIE_NAME = 'geo_last_seen';
export const GEO_VISIT_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
/** After a visit from a disallowed country, even allowed-country requests stay throttled for this long. */
export const GEO_FLAG_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export const GEO_RESTRICTED_COOKIE_NAME = 'rate_limit_geo_restricted';
export const GEO_RESTRICTED_MAX_PER_WINDOW = 2;
export const GEO_RESTRICTED_WINDOW_MS = 24 * 60 * 60 * 1000;

/**
 * Country gate for public form POSTs.
 *
 * - Request from a disallowed country → denied (403).
 * - Request from an allowed country, but this browser was seen from a disallowed one in the last
 *   `GEO_FLAG_DURATION_MS` (e.g. VPN switched to an allowed exit) → allowed, but throttled hard.
 * - Everything else → allowed.
 *
 * The browser's last country/IP live in an HMAC-signed httpOnly cookie, so a client that drops cookies
 * starts clean. This is a soft gate against casual abuse, not a defence against a determined VPN user.
 */
export async function checkGeoRestriction(request: Request): Promise<GeoRestrictionResult> {
  const allowedCountries = getAllowedCountries();
  if (!allowedCountries) {
    return { allowed: true };
  }

  const country = getRequestCountry(request);
  if (!country) {
    // Nothing to geolocate on `next dev`; in production a missing header means the edge is misconfigured.
    if (process.env.NODE_ENV === 'development') {
      return { allowed: true };
    }

    console.error('Missing client country header for geo restriction.');
    return { allowed: false, status: 503, error: 'Unable to verify your location. Please try again.' };
  }

  const secret = getSiteHmacSecret();
  const cookieStore = await cookies();
  const previous = secret ? readGeoVisitState(cookieStore.get(GEO_VISIT_COOKIE_NAME)?.value, secret) : null;

  const { decision, next } = evaluateGeoAccess({
    country,
    ip: getRequestIp(request),
    allowedCountries,
    previous,
    now: Date.now()
  });

  if (secret) {
    cookieStore.set(GEO_VISIT_COOKIE_NAME, signJsonCookiePayload(next, secret), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: GEO_VISIT_COOKIE_MAX_AGE_SECONDS
    });
  }

  if (decision === 'deny') {
    return {
      allowed: false,
      status: 403,
      error: `This form is not available in your region. Please email ${getContactToAddress()} instead.`
    };
  }

  if (decision === 'restrict') {
    const slot = await consumeSlidingWindowRateLimitSlot({
      cookieName: GEO_RESTRICTED_COOKIE_NAME,
      maxPerWindow: GEO_RESTRICTED_MAX_PER_WINDOW,
      windowMs: GEO_RESTRICTED_WINDOW_MS
    });

    if (slot.reason === 'misconfigured') {
      console.error('SITE_HMAC_SECRET is not configured for geo restriction.');
      return { allowed: false, status: 500, error: 'Server misconfigured.' };
    }

    if (!slot.allowed) {
      return {
        allowed: false,
        status: 429,
        error: `Too many messages from this connection. Please try again tomorrow or email ${getContactToAddress()}.`,
        retryAfterSeconds: GEO_RESTRICTED_WINDOW_MS / 1000
      };
    }
  }

  return { allowed: true };
}

/** JSON error response for a denied `GeoRestrictionResult`. */
export function geoRestrictionResponse(result: GeoRestrictionFailure): NextResponse {
  return NextResponse.json(
    { error: result.error },
    {
      status: result.status,
      headers: result.retryAfterSeconds ? { 'Retry-After': String(result.retryAfterSeconds) } : undefined
    }
  );
}

/** Pure decision step — no cookies, no env — so the policy is unit-testable. */
export function evaluateGeoAccess(input: GeoAccessInput): GeoAccessEvaluation {
  const isAllowedCountry = input.allowedCountries.has(input.country);
  const foreignAt = isAllowedCountry ? (input.previous?.foreignAt ?? null) : input.now;

  const next: GeoVisitState = { v: 1, country: input.country, ip: input.ip, foreignAt };

  if (!isAllowedCountry) {
    return { decision: 'deny', next };
  }

  const isFlagged = foreignAt !== null && input.now - foreignAt < GEO_FLAG_DURATION_MS;
  return { decision: isFlagged ? 'restrict' : 'allow', next };
}

function readGeoVisitState(raw: string | undefined, secret: string): GeoVisitState | null {
  const parsed = readSignedJsonCookiePayload(raw, secret);
  if (!parsed || parsed.v !== 1 || typeof parsed.country !== 'string') {
    return null;
  }

  return {
    v: 1,
    country: parsed.country,
    ip: typeof parsed.ip === 'string' ? parsed.ip : null,
    foreignAt: typeof parsed.foreignAt === 'number' && Number.isFinite(parsed.foreignAt) ? parsed.foreignAt : null
  };
}

export interface GeoVisitState {
  v: 1;
  /** Country of the most recent request from this browser. */
  country: string;
  /** IP of the most recent request from this browser. */
  ip: string | null;
  /** Last time this browser was seen from a disallowed country (epoch ms). */
  foreignAt: number | null;
}

export type GeoAccessDecision = 'allow' | 'restrict' | 'deny';

export interface GeoAccessInput {
  country: string;
  ip: string | null;
  allowedCountries: ReadonlySet<string>;
  previous: GeoVisitState | null;
  now: number;
}

export interface GeoAccessEvaluation {
  decision: GeoAccessDecision;
  next: GeoVisitState;
}

export interface GeoRestrictionFailure {
  allowed: false;
  status: 403 | 429 | 500 | 503;
  error: string;
  retryAfterSeconds?: number;
}

export type GeoRestrictionResult = { allowed: true } | GeoRestrictionFailure;
