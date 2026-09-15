import { cookies } from 'next/headers';

import { OWNERSHIP_COOKIE_MAX_AGE_SECONDS, OWNERSHIP_COOKIE_NAME } from './constants';
import { appendOwnedJob, readSignedOwnershipPayload, signOwnershipPayload } from './ownership-token';
import { getOwnershipSecret, isOwnershipSecretConfigured } from './secrets';

export { isOwnershipSecretConfigured };

export async function rememberOwnedJobId(jobId: string): Promise<void> {
  const secret = getOwnershipSecret();
  if (!secret) {
    throw new Error('ESTIMATOR_OWNERSHIP_SECRET is not configured.');
  }

  const cookieStore = await cookies();
  const now = Math.floor(Date.now() / 1000);
  const existing = readSignedOwnershipPayload(cookieStore.get(OWNERSHIP_COOKIE_NAME)?.value, secret, now);
  const payload = appendOwnedJob(existing, jobId, now);

  cookieStore.set(OWNERSHIP_COOKIE_NAME, signOwnershipPayload(payload, secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: OWNERSHIP_COOKIE_MAX_AGE_SECONDS
  });
}

export async function ownsJobId(jobId: string): Promise<boolean> {
  const secret = getOwnershipSecret();
  if (!secret) {
    return false;
  }

  const cookieStore = await cookies();
  const now = Math.floor(Date.now() / 1000);
  const payload = readSignedOwnershipPayload(cookieStore.get(OWNERSHIP_COOKIE_NAME)?.value, secret, now);
  return payload.jobs.some((job) => job.id === jobId);
}

export async function getLatestOwnedJobId(): Promise<string | null> {
  const secret = getOwnershipSecret();
  if (!secret) {
    return null;
  }

  const cookieStore = await cookies();
  const now = Math.floor(Date.now() / 1000);
  const payload = readSignedOwnershipPayload(cookieStore.get(OWNERSHIP_COOKIE_NAME)?.value, secret, now);
  if (payload.jobs.length === 0) {
    return null;
  }

  return payload.jobs[payload.jobs.length - 1]?.id ?? null;
}
