-- purpose: persist smart-estimation request outcomes for ops review
-- affected: public.estimation_logs, private.is_secure (if missing)
-- risks: stores raw request text and client ip (pii); service-role only writes

create schema if not exists private;

-- returns false for client roles; service_role bypasses rls entirely
create or replace function private.is_secure()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select false;
$$;

create table if not exists public.estimation_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  job_id text,
  status text not null,
  request_text text,
  file_name text,
  error_message text,
  ip text
);

comment on table public.estimation_logs is 'Smart estimation generate attempts (queued → completed/failed).';
comment on column public.estimation_logs.request_text is 'Submitted project text at create time.';
comment on column public.estimation_logs.ip is 'Client ip from proxy headers at create time.';

create unique index if not exists estimation_logs_job_id_uidx
  on public.estimation_logs (job_id)
  where job_id is not null;

create index if not exists estimation_logs_created_at_idx
  on public.estimation_logs (created_at desc);

create index if not exists estimation_logs_status_idx
  on public.estimation_logs (status);

alter table public.estimation_logs enable row level security;

-- restrictive gate required by project rls rules (clients always denied here)
create policy "require secure session"
  on public.estimation_logs
  as restrictive
  for all
  to authenticated, anon
  using ((select private.is_secure()))
  with check ((select private.is_secure()));
