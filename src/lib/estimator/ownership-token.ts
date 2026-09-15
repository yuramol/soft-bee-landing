import { OWNERSHIP_COOKIE_MAX_AGE_SECONDS, OWNERSHIP_MAX_JOBS } from './constants';
import { isJsonObject, readSignedJsonCookiePayload, signJsonCookiePayload } from '@/lib/security';

export interface OwnedJob {
  id: string;
  exp: number;
}

export interface OwnershipPayload {
  v: 1;
  jobs: OwnedJob[];
}

export function appendOwnedJob(existing: OwnershipPayload, jobId: string, now: number): OwnershipPayload {
  const withoutExpired = existing.jobs.filter((job) => job.exp > now && job.id !== jobId);
  const jobs: OwnedJob[] = [...withoutExpired, { id: jobId, exp: now + OWNERSHIP_COOKIE_MAX_AGE_SECONDS }].slice(-OWNERSHIP_MAX_JOBS);

  return { v: 1, jobs };
}

export function signOwnershipPayload(payload: OwnershipPayload, secret: string): string {
  return signJsonCookiePayload(payload, secret);
}

export function readSignedOwnershipPayload(raw: string | undefined, secret: string, now: number): OwnershipPayload {
  const parsed = readSignedJsonCookiePayload(raw, secret);
  if (!parsed || parsed.v !== 1 || !Array.isArray(parsed.jobs)) {
    return { v: 1, jobs: [] };
  }

  const jobs: OwnedJob[] = [];
  for (const entry of parsed.jobs) {
    if (!isJsonObject(entry)) continue;
    if (typeof entry.id !== 'string' || entry.id.length === 0) continue;
    if (typeof entry.exp !== 'number' || !Number.isFinite(entry.exp)) continue;
    if (entry.exp <= now) continue;
    jobs.push({ id: entry.id, exp: entry.exp });
  }

  return { v: 1, jobs };
}
