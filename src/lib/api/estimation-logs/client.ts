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
