/**
 * Server-only estimator secrets.
 * ESTIMATOR_OWNERSHIP_SECRET is required in every environment (no hardcoded fallback).
 */
export function getOwnershipSecret(): string | null {
  const fromEnv = process.env.ESTIMATOR_OWNERSHIP_SECRET?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : null;
}

export function isOwnershipSecretConfigured(): boolean {
  return getOwnershipSecret() !== null;
}
