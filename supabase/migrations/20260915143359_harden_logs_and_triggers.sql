-- purpose: harden estimation/contact logs with indexes, triggers, and constraints
-- affected: public.estimation_logs, public.contact_submission_logs, public.trigger_set_updated_at
-- risks: none (additive only; no data changes)

-- reusable updated_at trigger function (if not exists pattern)
create or replace function public.trigger_set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.trigger_set_updated_at is 'Standard updated_at trigger for any table with an updated_at timestamptz column.';

-- add updated_at trigger to estimation_logs if not exists
do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'set_updated_at'
    and tgrelid = 'public.estimation_logs'::regclass
  ) then
    create trigger set_updated_at
      before update on public.estimation_logs
      for each row
      execute function public.trigger_set_updated_at();
  end if;
end $$;

-- add updated_at trigger to contact_submission_logs if not exists
do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'set_updated_at'
    and tgrelid = 'public.contact_submission_logs'::regclass
  ) then
    create trigger set_updated_at
      before update on public.contact_submission_logs
      for each row
      execute function public.trigger_set_updated_at();
  end if;
end $$;

-- add ip+created_at index to estimation_logs if not exists
create index if not exists estimation_logs_ip_created_at_idx
  on public.estimation_logs (ip, created_at desc);

-- add status constraint to estimation_logs if not exists
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'estimation_logs_status_check'
    and conrelid = 'public.estimation_logs'::regclass
  ) then
    alter table public.estimation_logs
      add constraint estimation_logs_status_check
      check (status in ('queued', 'completed', 'failed'));
  end if;
end $$;

-- add status constraint to contact_submission_logs if not exists
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'contact_submission_logs_status_check'
    and conrelid = 'public.contact_submission_logs'::regclass
  ) then
    alter table public.contact_submission_logs
      add constraint contact_submission_logs_status_check
      check (status in ('queued', 'sent', 'failed'));
  end if;
end $$;

-- revoke direct access from anon/authenticated if not already done
-- (rls restrictive policy handles this, but explicit revoke is defense in depth)
do $$
begin
  revoke all on public.estimation_logs from anon, authenticated;
  revoke all on public.contact_submission_logs from anon, authenticated;
exception
  when undefined_object then
    -- roles may not exist in all environments
    null;
end $$;
