-- purpose: harden articles/tags/article_tags rls for public select and service-only writes
-- affected: policies and grants on public.tags, public.articles, public.article_tags
-- risks: enables anon/authenticated select (previously blocked by restrictive is_secure on select);
--        client insert/update/delete remain denied (no write grants; restrictive write gates)
-- note: idempotent — safe after create_articles (old or updated) and on re-run

-- drop legacy policies (for-all secure session + anon-only select)
drop policy if exists "require secure session" on public.tags;
drop policy if exists "require secure session" on public.articles;
drop policy if exists "require secure session" on public.article_tags;
drop policy if exists "anon can select tags" on public.tags;
drop policy if exists "anon can select articles" on public.articles;
drop policy if exists "anon can select article_tags" on public.article_tags;

-- drop current public-read / write-gate policies (idempotent recreate)
drop policy if exists "public can select tags" on public.tags;
drop policy if exists "public can select articles" on public.articles;
drop policy if exists "public can select article_tags" on public.article_tags;
drop policy if exists "require secure session for insert" on public.tags;
drop policy if exists "require secure session for update" on public.tags;
drop policy if exists "require secure session for delete" on public.tags;
drop policy if exists "require secure session for insert" on public.articles;
drop policy if exists "require secure session for update" on public.articles;
drop policy if exists "require secure session for delete" on public.articles;
drop policy if exists "require secure session for insert" on public.article_tags;
drop policy if exists "require secure session for update" on public.article_tags;
drop policy if exists "require secure session for delete" on public.article_tags;

-- ---------------------------------------------------------------------------
-- public read (anon + authenticated)
-- ---------------------------------------------------------------------------
create policy "public can select tags"
  on public.tags
  for select
  to anon, authenticated
  using (true);

create policy "public can select articles"
  on public.articles
  for select
  to anon, authenticated
  using (true);

create policy "public can select article_tags"
  on public.article_tags
  for select
  to anon, authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- write gates for client roles (private.is_secure() is always false for clients;
-- service_role bypasses rls and is the only writer)
-- scoped to writes so public select stays allowed (unlike private log tables)
-- ---------------------------------------------------------------------------
create policy "require secure session for insert"
  on public.tags
  as restrictive
  for insert
  to anon, authenticated
  with check ((select private.is_secure()));

create policy "require secure session for update"
  on public.tags
  as restrictive
  for update
  to anon, authenticated
  using ((select private.is_secure()))
  with check ((select private.is_secure()));

create policy "require secure session for delete"
  on public.tags
  as restrictive
  for delete
  to anon, authenticated
  using ((select private.is_secure()));

create policy "require secure session for insert"
  on public.articles
  as restrictive
  for insert
  to anon, authenticated
  with check ((select private.is_secure()));

create policy "require secure session for update"
  on public.articles
  as restrictive
  for update
  to anon, authenticated
  using ((select private.is_secure()))
  with check ((select private.is_secure()));

create policy "require secure session for delete"
  on public.articles
  as restrictive
  for delete
  to anon, authenticated
  using ((select private.is_secure()));

create policy "require secure session for insert"
  on public.article_tags
  as restrictive
  for insert
  to anon, authenticated
  with check ((select private.is_secure()));

create policy "require secure session for update"
  on public.article_tags
  as restrictive
  for update
  to anon, authenticated
  using ((select private.is_secure()))
  with check ((select private.is_secure()));

create policy "require secure session for delete"
  on public.article_tags
  as restrictive
  for delete
  to anon, authenticated
  using ((select private.is_secure()));

-- ---------------------------------------------------------------------------
-- grants: select only for clients (defense in depth; service_role keeps full access)
-- ---------------------------------------------------------------------------
revoke all on public.tags from anon, authenticated;
revoke all on public.articles from anon, authenticated;
revoke all on public.article_tags from anon, authenticated;

grant select on public.tags to anon, authenticated;
grant select on public.articles to anon, authenticated;
grant select on public.article_tags to anon, authenticated;
