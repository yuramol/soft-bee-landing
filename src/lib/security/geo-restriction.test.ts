import { afterEach, describe, expect, it } from 'vitest';

import { GEO_FLAG_DURATION_MS, evaluateGeoAccess, type GeoVisitState } from './geo-restriction';
import { getAllowedCountries, getRequestCountry } from './request-country';

const NOW = Date.UTC(2026, 9, 26, 12, 0, 0);
const ALLOWED = new Set(['UA']);

function requestWithHeaders(headers: Record<string, string>): Request {
  return new Request('https://softbee.io/api/contact', { method: 'POST', headers });
}

describe('getRequestCountry', () => {
  it('reads the Vercel country header and normalizes case', () => {
    expect(getRequestCountry(requestWithHeaders({ 'x-vercel-ip-country': 'ua' }))).toBe('UA');
  });

  it('falls back to the Cloudflare header', () => {
    expect(getRequestCountry(requestWithHeaders({ 'cf-ipcountry': 'DE' }))).toBe('DE');
  });

  it('returns null for missing, unknown or malformed values', () => {
    expect(getRequestCountry(requestWithHeaders({}))).toBeNull();
    expect(getRequestCountry(requestWithHeaders({ 'cf-ipcountry': 'XX' }))).toBeNull();
    expect(getRequestCountry(requestWithHeaders({ 'x-vercel-ip-country': 'Ukraine' }))).toBeNull();
  });
});

describe('getAllowedCountries', () => {
  const previous = process.env.SITE_ALLOWED_COUNTRIES;

  afterEach(() => {
    if (previous === undefined) {
      delete process.env.SITE_ALLOWED_COUNTRIES;
    } else {
      process.env.SITE_ALLOWED_COUNTRIES = previous;
    }
  });

  it('allows every country when unset or empty', () => {
    delete process.env.SITE_ALLOWED_COUNTRIES;
    expect(getAllowedCountries()).toBeNull();

    process.env.SITE_ALLOWED_COUNTRIES = '  ';
    expect(getAllowedCountries()).toBeNull();
  });

  it('parses a comma-separated list', () => {
    process.env.SITE_ALLOWED_COUNTRIES = 'ua, pl';
    expect(getAllowedCountries()).toEqual(new Set(['UA', 'PL']));
  });

  it('treats * as allow-all', () => {
    process.env.SITE_ALLOWED_COUNTRIES = '*';
    expect(getAllowedCountries()).toBeNull();
  });

  it('ignores invalid entries but keeps the valid ones', () => {
    process.env.SITE_ALLOWED_COUNTRIES = 'UA, Romania';
    expect(getAllowedCountries()).toEqual(new Set(['UA']));
  });

  it('denies everyone (not allow-all) when no entry is a valid code', () => {
    process.env.SITE_ALLOWED_COUNTRIES = 'Ukraine';
    expect(getAllowedCountries()).toEqual(new Set());
  });
});

describe('evaluateGeoAccess', () => {
  it('allows a first-time visitor from an allowed country', () => {
    const result = evaluateGeoAccess({ country: 'UA', ip: '1.1.1.1', allowedCountries: ALLOWED, previous: null, now: NOW });

    expect(result.decision).toBe('allow');
    expect(result.next).toEqual({ v: 1, country: 'UA', ip: '1.1.1.1', foreignAt: null });
  });

  it('denies a visitor from another country and remembers the sighting', () => {
    const result = evaluateGeoAccess({ country: 'DE', ip: '2.2.2.2', allowedCountries: ALLOWED, previous: null, now: NOW });

    expect(result.decision).toBe('deny');
    expect(result.next).toEqual({ v: 1, country: 'DE', ip: '2.2.2.2', foreignAt: NOW });
  });

  it('restricts an allowed-country request from a browser recently seen abroad', () => {
    const previous: GeoVisitState = { v: 1, country: 'DE', ip: '2.2.2.2', foreignAt: NOW - 60_000 };
    const result = evaluateGeoAccess({ country: 'UA', ip: '1.1.1.1', allowedCountries: ALLOWED, previous, now: NOW });

    expect(result.decision).toBe('restrict');
    // The flag must survive the first allowed-country request, otherwise VPN-hopping resets it.
    expect(result.next.foreignAt).toBe(previous.foreignAt);
  });

  it('keeps restricting on later allowed-country requests until the flag expires', () => {
    const afterFirstHop: GeoVisitState = { v: 1, country: 'UA', ip: '1.1.1.1', foreignAt: NOW - 60_000 };
    const result = evaluateGeoAccess({ country: 'UA', ip: '1.1.1.1', allowedCountries: ALLOWED, previous: afterFirstHop, now: NOW });

    expect(result.decision).toBe('restrict');
  });

  it('stops restricting once the flag duration has passed', () => {
    const stale: GeoVisitState = { v: 1, country: 'UA', ip: '1.1.1.1', foreignAt: NOW - GEO_FLAG_DURATION_MS };
    const result = evaluateGeoAccess({ country: 'UA', ip: '1.1.1.1', allowedCountries: ALLOWED, previous: stale, now: NOW });

    expect(result.decision).toBe('allow');
  });
});
