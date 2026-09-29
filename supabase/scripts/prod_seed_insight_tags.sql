-- purpose: seed Insights category tags on production (idempotent)
-- affected: public.tags
-- notes:
--   - Safe to re-run (on conflict by slug / name).
--   - AI-sourced news should use category / tag "Tech & Dev".
--   - Does not insert articles — only the three tab categories.
-- run: paste into Supabase SQL editor (prod) or `psql` against the prod DB.

insert into public.tags (name, slug) values
  ('Tech & Dev', 'tech-dev'),
  ('Team & Workflow', 'team-workflow'),
  ('Company news', 'company-news')
on conflict (slug) do nothing;

-- If a row exists with the same name but a different slug, leave it alone.
-- Verify:
--   select name, slug, created_at from public.tags order by created_at;
