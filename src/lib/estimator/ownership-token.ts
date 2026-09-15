import { createHmac, timingSafeEqual } from 'crypto';

import { OWNERSHIP_COOKIE_MAX_AGE_SECONDS, OWNERSHIP_MAX_JOBS } from './constants';
import { isJsonObject, parseJsonValue } from './json';

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
  const jobs: OwnedJob[] = [...withoutExpired, { id: jobId, exp: now + OWNERSHIP_COOKIE_MAX_AGE_SECONDS }].slice(
    -OWNERSHIP_MAX_JOBS
  );

  return { v: 1, jobs };
}

export function signOwnershipPayload(payload: OwnershipPayload, secret: string): string {
  const body = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const signature = createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${signature}`;
}

export function readSignedOwnershipPayload(raw: string | undefined, secret: string, now: number): OwnershipPayload {
  if (!raw) {
    return { v: 1, jobs: [] };
  }

  const separatorIndex = raw.lastIndexOf('.');
  if (separatorIndex <= 0 || separatorIndex === raw.length - 1) {
    return { v: 1, jobs: [] };
  }

  const body = raw.slice(0, separatorIndex);
  const signature = raw.slice(separatorIndex + 1);
  const expected = createHmac('sha256', secret).update(body).digest('base64url');

  if (!safeEqualBase64Url(signature, expected)) {
    return { v: 1, jobs: [] };
  }

  try {
    const parsed = parseJsonValue(Buffer.from(body, 'base64url').toString('utf8'));
    if (!isJsonObject(parsed) || parsed.v !== 1 || !Array.isArray(parsed.jobs)) {
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
  } catch {
    return { v: 1, jobs: [] };
  }
}

function safeEqualBase64Url(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}
