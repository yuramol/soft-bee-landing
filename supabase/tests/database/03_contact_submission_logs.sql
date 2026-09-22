-- purpose: pgtap coverage for public.contact_submission_logs
-- affected: read-only assertions against public.contact_submission_logs schema, indexes,
--           trigger, check constraint, rls policy, and role-level access
-- risks: none; runs inside a rolled-back transaction, no data is persisted

begin;

create extension if not exists pgtap with schema extensions;

select plan(10);

select has_table(
  'public',
  'contact_submission_logs',
  'public.contact_submission_logs table should exist'
);

select col_is_pk(
  'public',
  'contact_submission_logs',
  'id',
  'public.contact_submission_logs.id should be the primary key'
);

select has_column(
  'public',
  'contact_submission_logs',
  'ip',
  'public.contact_submission_logs should have an ip column'
);

select has_column(
  'public',
  'contact_submission_logs',
  'status',
  'public.contact_submission_logs should have a status column'
);

select has_index(
  'public',
  'contact_submission_logs',
  'contact_submission_logs_ip_created_at_idx',
  'public.contact_submission_logs should have an ip/created_at index'
);

select has_trigger(
  'public',
  'contact_submission_logs',
  'set_updated_at',
  'public.contact_submission_logs should have the set_updated_at trigger'
);

select ok(
  (select relrowsecurity from pg_class where oid = 'public.contact_submission_logs'::regclass),
  'public.contact_submission_logs should have row level security enabled'
);

select ok(
  exists(
    select 1 from pg_constraint
    where conname = 'contact_submission_logs_status_check'
    and conrelid = 'public.contact_submission_logs'::regclass
  ),
  'public.contact_submission_logs should have a status check constraint'
);

set local role authenticated;

select throws_ok(
  'select 1 from public.contact_submission_logs limit 1',
  '42501',
  null,
  'authenticated role should not be able to select from public.contact_submission_logs'
);

reset role;

set local role anon;

select throws_ok(
  'select 1 from public.contact_submission_logs limit 1',
  '42501',
  null,
  'anon role should not be able to select from public.contact_submission_logs'
);

reset role;

select * from finish();

rollback;
