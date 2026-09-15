import { createServiceClient } from '@/utils/supabase/server';
import type { ContactKind } from '@/lib/contact/types';

// Note: contact_submission_logs uses `as any` until types are regenerated post-migration.
// Run `yarn sb:db:types` after applying migrations to update src/types/supabaseSchema.ts.

export type ContactLogStatus = 'queued' | 'sent' | 'failed';

export interface CreateContactLogInput {
  kind: ContactKind;
  status: ContactLogStatus;
  ip: string;
  errorMessage?: string | null;
}

export interface UpdateContactLogInput {
  id: string;
  status: ContactLogStatus;
  errorMessage?: string | null;
}

/** Insert a contact log row and return its id. Returns null on failure (callers should fail closed). */
export async function reserveContactSubmission(input: CreateContactLogInput): Promise<string | null> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('contact_submission_logs' as any)
      .insert({
        kind: input.kind,
        status: input.status,
        ip: input.ip,
        error_message: input.errorMessage ?? null
      })
      .select('id')
      .single();

    if (error || !(data as any)?.id) {
      console.error('Failed to reserve contact submission:', error?.message ?? 'missing id');
      return null;
    }

    return (data as any).id;
  } catch (error) {
    console.error('Failed to reserve contact submission:', error);
    return null;
  }
}

export async function updateContactLog(input: UpdateContactLogInput): Promise<void> {
  try {
    const supabase = createServiceClient();
    const { error } = await supabase
      .from('contact_submission_logs' as any)
      .update({
        status: input.status,
        error_message: input.errorMessage ?? null,
        updated_at: new Date().toISOString()
      })
      .eq('id', input.id);

    if (error) {
      console.error('Failed to update contact log:', error.message);
    }
  } catch (error) {
    console.error('Failed to update contact log:', error);
  }
}

/** Count contact attempts from an IP in the rolling window (all statuses). Null means query failed. */
export async function countContactAttemptsByIp(ip: string, sinceIso: string): Promise<number | null> {
  try {
    const supabase = createServiceClient();
    const { count, error } = await supabase
      .from('contact_submission_logs' as any)
      .select('id', { count: 'exact', head: true })
      .eq('ip', ip)
      .gte('created_at', sinceIso);

    if (error) {
      console.error('Failed to count contact attempts by IP:', error.message);
      return null;
    }

    return count ?? 0;
  } catch (error) {
    console.error('Failed to count contact attempts by IP:', error);
    return null;
  }
}
