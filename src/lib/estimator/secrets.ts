/**
 * Server-only estimator secrets.
 * SITE_HMAC_SECRET is required in every environment (no hardcoded fallback).
 * ESTIMATOR_OWNERSHIP_SECRET remains a temporary alias.
 */
export { getSiteHmacSecret as getOwnershipSecret, isSiteHmacSecretConfigured as isOwnershipSecretConfigured } from '@/lib/security';
