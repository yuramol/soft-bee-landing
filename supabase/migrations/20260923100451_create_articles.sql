-- purpose: create articles entity with tags support, prioritized flag, and full-text search
-- affected: public.articles, public.tags, public.article_tags (new tables)
-- risks: none (additive only; no existing data)

-- tags lookup table
create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.tags is 'Tag definitions for categorizing articles.';
comment on column public.tags.slug is 'URL-friendly identifier for the tag.';

-- articles table
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  image text not null,
  category text not null,
  read_time text not null,
  author_name text not null,
  author_role text not null,
  author_image text not null,
  published_at timestamptz not null,
  content jsonb not null default '[]'::jsonb,
  prioritized boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  constraint articles_category_check check (category in ('Tech & Dev', 'Team & Workflow', 'Company news'))
);

comment on table public.articles is 'Insight articles for the blog/insights section.';
comment on column public.articles.slug is 'URL-safe unique identifier for the article.';
comment on column public.articles.content is 'Article content blocks as JSON array matching ArticleBlockContent[] interface.';
comment on column public.articles.prioritized is 'When true, this article ranks above AI-sourced articles in future merged feeds.';
comment on column public.articles.category is 'Article category matching UI tabs: Tech & Dev, Team & Workflow, or Company news.';

-- article-tag junction table
create table public.article_tags (
  article_id uuid not null references public.articles(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  
  primary key (article_id, tag_id)
);

comment on table public.article_tags is 'Many-to-many junction between articles and tags.';

-- indexes for performance
create index articles_slug_idx on public.articles (slug);
create index articles_category_idx on public.articles (category);
create index articles_prioritized_published_idx on public.articles (prioritized desc, published_at desc);
create index article_tags_article_id_idx on public.article_tags (article_id);
create index article_tags_tag_id_idx on public.article_tags (tag_id);

-- full-text search: tsvector column + GIN index
alter table public.articles add column search_vector tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B')
  ) stored;

create index articles_search_vector_idx on public.articles using gin (search_vector);

comment on column public.articles.search_vector is 'Generated full-text search vector over title (weight A) and description (weight B).';

-- updated_at triggers
create trigger set_updated_at
  before update on public.tags
  for each row
  execute function public.trigger_set_updated_at();

create trigger set_updated_at
  before update on public.articles
  for each row
  execute function public.trigger_set_updated_at();

-- enable RLS
alter table public.tags enable row level security;
alter table public.articles enable row level security;
alter table public.article_tags enable row level security;

-- public read (anon + authenticated)
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

-- write gates for client roles (private.is_secure() is always false for clients;
-- service_role bypasses rls and is the only writer)
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

-- revoke direct table access (defense in depth; service role and rls policies control access)
revoke all on public.tags from anon, authenticated;
revoke all on public.articles from anon, authenticated;
revoke all on public.article_tags from anon, authenticated;

grant select on public.tags to anon, authenticated;
grant select on public.articles to anon, authenticated;
grant select on public.article_tags to anon, authenticated;
