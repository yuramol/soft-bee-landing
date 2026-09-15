-- purpose: persist contact form submission attempts for rate limiting and ops review
-- affected: public.contact_submission_logs
-- risks: stores pii (ip, email); service-role only writes

create table if not exists public.contact_submission_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  kind text not null,
  status text not null,
  ip text not null,
  error_message text
);

comment on table public.contact_submission_logs is 'Contact form submission attempts (all kinds) for rate limiting and monitoring.';
comment on column public.contact_submission_logs.kind is 'Contact kind: discuss_project, request_info, vacancy_application.';
comment on column public.contact_submission_logs.status is 'Submission status: queued, sent, failed.';
comment on column public.contact_submission_logs.ip is 'Client IP from proxy headers at submission time.';

create index if not exists contact_submission_logs_ip_created_at_idx
  on public.contact_submission_logs (ip, created_at desc);

create index if not exists contact_submission_logs_created_at_idx
  on public.contact_submission_logs (created_at desc);

create index if not exists contact_submission_logs_status_idx
  on public.contact_submission_logs (status);

alter table public.contact_submission_logs enable row level security;

-- restrictive gate required by project rls rules (clients always denied here)
create policy "require secure session"
  on public.contact_submission_logs
  as restrictive
  for all
  to authenticated, anon
  using ((select private.is_secure()))
  with check ((select private.is_secure()));
