-- purpose: pgtap coverage for public.users table (schema from db_init + create_user_trigger)
-- affected: read-only assertions against public.users, public.trim_and_lowercase_email,
--           and the auth.users -> public.users provisioning trigger
-- risks: none; runs inside a rolled-back transaction, no data is persisted

begin;

create extension if not exists pgtap with schema extensions;

select plan(6);

select has_table('public', 'users', 'public.users table should exist');

select has_column('public', 'users', 'id', 'public.users should have an id column');

select col_is_pk('public', 'users', 'id', 'public.users.id should be the primary key');

select ok(
  (select relrowsecurity from pg_class where oid = 'public.users'::regclass),
  'public.users should have row level security enabled'
);

select has_function(
  'public',
  'trim_and_lowercase_email',
  'public.trim_and_lowercase_email function should exist'
);

select has_trigger(
  'auth',
  'users',
  'create_user',
  'create_user trigger should exist on auth.users to provision public.users rows'
);

select * from finish();

rollback;
