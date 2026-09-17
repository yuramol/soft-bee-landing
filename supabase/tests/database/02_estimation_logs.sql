-- purpose: pgtap coverage for public.estimation_logs and private.is_secure
-- affected: read-only assertions against public.estimation_logs schema, indexes,
--           trigger, check constraint, rls policy, and role-level access
-- risks: none; runs inside a rolled-back transaction, no data is persisted

begin;

create extension if not exists pgtap with schema extensions;

select plan(14);

select has_table('public', 'estimation_logs', 'public.estimation_logs table should exist');

select col_is_pk('public', 'estimation_logs', 'id', 'public.estimation_logs.id should be the primary key');

select has_column('public', 'estimation_logs', 'status', 'public.estimation_logs should have a status column');

select has_column('public', 'estimation_logs', 'job_id', 'public.estimation_logs should have a job_id column');

select has_index(
  'public',
  'estimation_logs',
  'estimation_logs_job_id_uidx',
  'public.estimation_logs should have a job_id index'
);

select index_is_unique(
  'public',
  'estimation_logs',
  'estimation_logs_job_id_uidx',
  'estimation_logs_job_id_uidx should be unique'
);

select has_index(
  'public',
  'estimation_logs',
  'estimation_logs_status_idx',
  'public.estimation_logs should have a status index'
);

select has_trigger(
  'public',
  'estimation_logs',
  'set_updated_at',
  'public.estimation_logs should have the set_updated_at trigger'
);

select ok(
  (select relrowsecurity from pg_class where oid = 'public.estimation_logs'::regclass),
  'public.estimation_logs should have row level security enabled'
);

select ok(
  exists(
    select 1 from pg_constraint
    where conname = 'estimation_logs_status_check'
    and conrelid = 'public.estimation_logs'::regclass
  ),
  'public.estimation_logs should have a status check constraint'
);

select has_function('private', 'is_secure', 'private.is_secure function should exist');

select is(
  private.is_secure(),
  false,
  'private.is_secure should return false by default'
);

set local role authenticated;

select throws_ok(
  'select 1 from public.estimation_logs limit 1',
  '42501',
  null,
  'authenticated role should not be able to select from public.estimation_logs'
);

reset role;

set local role anon;

select throws_ok(
  'select 1 from public.estimation_logs limit 1',
  '42501',
  null,
  'anon role should not be able to select from public.estimation_logs'
);

reset role;

select * from finish();

rollback;
