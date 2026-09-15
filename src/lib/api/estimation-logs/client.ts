import { createServiceClient } from '@/utils/supabase/server';

export type EstimationLogStatus = 'queued' | 'completed' | 'failed';

export interface CreateEstimationLogInput {
  jobId?: string | null;
  status: EstimationLogStatus;
  requestText?: string | null;
  fileName?: string | null;
  errorMessage?: string | null;
  ip?: string | null;
}

export interface FinalizeEstimationLogInput {
  jobId: string;
  status: 'completed' | 'failed';
  errorMessage?: string | null;
}

export interface UpdateEstimationLogInput {
  id: string;
  jobId?: string | null;
  status: EstimationLogStatus;
  requestText?: string | null;
  fileName?: string | null;
  errorMessage?: string | null;
}

/** Insert a log row and return its id. Returns null on failure (callers should fail closed). */
export async function reserveEstimationAttempt(input: CreateEstimationLogInput): Promise<string | null> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('estimation_logs')
      .insert({
        job_id: input.jobId ?? null,
        status: input.status,
        request_text: input.requestText ?? null,
        file_name: input.fileName ?? null,
        error_message: input.errorMessage ?? null,
        ip: input.ip ?? null
      })
      .select('id')
      .single();

    if (error || !data?.id) {
      console.error('Failed to reserve estimation attempt:', error?.message ?? 'missing id');
      return null;
    }

    return data.id;
  } catch (error) {
    console.error('Failed to reserve estimation attempt:', error);
    return null;
  }
}

export async function updateEstimationLog(input: UpdateEstimationLogInput): Promise<void> {
  try {
    const supabase = createServiceClient();
    const { error } = await supabase
      .from('estimation_logs')
      .update({
        job_id: input.jobId ?? null,
        status: input.status,
        request_text: input.requestText ?? null,
        file_name: input.fileName ?? null,
        error_message: input.errorMessage ?? null,
        updated_at: new Date().toISOString()
      })
      .eq('id', input.id);

    if (error) {
      console.error('Failed to update estimation log:', error.message);
    }
  } catch (error) {
    console.error('Failed to update estimation log:', error);
  }
}

export async function createEstimationLog(input: CreateEstimationLogInput): Promise<void> {
  await reserveEstimationAttempt(input);
}

export async function finalizeEstimationLog(input: FinalizeEstimationLogInput): Promise<void> {
  try {
    const supabase = createServiceClient();
    const { error } = await supabase
      .from('estimation_logs')
      .update({
        status: input.status,
        error_message: input.errorMessage ?? null,
        updated_at: new Date().toISOString()
      })
      .eq('job_id', input.jobId)
      .eq('status', 'queued');

    if (error) {
      console.error('Failed to finalize estimation log:', error.message);
    }
  } catch (error) {
    console.error('Failed to finalize estimation log:', error);
  }
}

/** Count generate attempts from an IP in the rolling window (all statuses). Null means query failed. */
export async function countEstimationAttemptsByIp(ip: string, sinceIso: string): Promise<number | null> {
  try {
    const supabase = createServiceClient();
    const { count, error } = await supabase
      .from('estimation_logs')
      .select('id', { count: 'exact', head: true })
      .eq('ip', ip)
      .gte('created_at', sinceIso);

    if (error) {
      console.error('Failed to count estimation attempts by IP:', error.message);
      return null;
    }

    return count ?? 0;
  } catch (error) {
    console.error('Failed to count estimation attempts by IP:', error);
    return null;
  }
}

const LOOPBACK_IPS = new Set(['::1', '0:0:0:0:0:0:0:1', '127.0.0.1', 'localhost']);

/**
 * Resolve the connecting client IP from proxy headers.
 * Prefers platform headers (Cloudflare / Vercel) over x-forwarded-for, and skips
 * loopback when a non-local candidate exists (common when local proxies prepend ::1).
 * On `next dev` / localhost-only traffic, ::1 / 127.0.0.1 is the real client address.
 */
export function getRequestIp(request: Request): string | null {
  const candidates: string[] = [];

  appendIpCandidates(candidates, request.headers.get('cf-connecting-ip'));
  appendIpCandidates(candidates, request.headers.get('true-client-ip'));
  appendIpCandidates(candidates, request.headers.get('x-vercel-forwarded-for'));
  appendIpCandidates(candidates, request.headers.get('x-real-ip'));
  appendIpCandidates(candidates, request.headers.get('x-client-ip'));
  appendIpCandidates(candidates, request.headers.get('x-forwarded-for'));
  appendForwardedHeaderCandidates(candidates, request.headers.get('forwarded'));

  const publicIp = candidates.find((ip) => !isLoopbackIp(ip));
  if (publicIp) return publicIp;

  return candidates[0] ?? null;
}

function appendIpCandidates(target: string[], headerValue: string | null): void {
  if (!headerValue) return;

  for (const part of headerValue.split(',')) {
    const ip = normalizeIp(part);
    if (ip) target.push(ip);
  }
}

function appendForwardedHeaderCandidates(target: string[], headerValue: string | null): void {
  if (!headerValue) return;

  for (const part of headerValue.split(',')) {
    const forMatch = /(?:^|;)\s*for=(?:"?\[?)([^\]";]+)/i.exec(part);
    const ip = normalizeIp(forMatch?.[1] ?? null);
    if (ip) target.push(ip);
  }
}

function normalizeIp(value: string | null | undefined): string | null {
  if (!value) return null;

  let ip = value.trim();
  if (!ip) return null;

  if (ip.startsWith('"') && ip.endsWith('"')) {
    ip = ip.slice(1, -1);
  }

  if (ip.startsWith('[') && ip.includes(']')) {
    ip = ip.slice(1, ip.indexOf(']'));
  } else if (/^\d{1,3}(?:\.\d{1,3}){3}:\d+$/.test(ip)) {
    ip = ip.replace(/:\d+$/, '');
  }

  if (ip.toLowerCase().startsWith('::ffff:')) {
    ip = ip.slice(7);
  }

  return ip || null;
}

function isLoopbackIp(ip: string): boolean {
  return LOOPBACK_IPS.has(ip.toLowerCase());
}
