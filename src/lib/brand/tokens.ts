/**
 * Hex mirrors of CSS brand tokens in `src/app/globals.css`.
 * Email clients cannot use CSS variables, so keep these in sync manually.
 */
export const BRAND_COLORS = {
  black: '#1b1c23',
  white: '#ffffff',
  electricGreen: '#c3ff00',
  limeGlow: '#d9ff7a',
  digitalCyan: '#00a2bb',
  deepTeal: '#007586',
  graphiteGray: '#444a57',
  mistGray: '#f5f5f5',
  lightGray: '#dad7d7'
} as const;

/** Public paths used on the landing (and absolute URLs for email clients). */
export const BRAND_ASSETS = {
  logoWhite: '/brand/logo-white.svg',
  mainGradient: '/backgrounds/main-gradient.webp'
} as const;

export const BRAND_DEFAULT_SITE_ORIGIN = 'https://softbee.io';

export function getBrandSiteOrigin(): string {
  const raw = process.env.SITE_ALLOWED_ORIGINS?.trim() || process.env.ESTIMATOR_ALLOWED_ORIGINS?.trim();
  if (raw) {
    const first = raw.split(',')[0]?.trim().replace(/\/$/, '');
    if (first) {
      return first;
    }
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return vercel.startsWith('http') ? vercel.replace(/\/$/, '') : `https://${vercel}`;
  }

  return BRAND_DEFAULT_SITE_ORIGIN;
}

export function getBrandAssetUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${getBrandSiteOrigin()}${normalized}`;
}
