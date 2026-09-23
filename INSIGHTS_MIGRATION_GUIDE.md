# Insights Migration Guide

This document explains how to test the Supabase-backed Insights feature migration.

## Quick Start

```bash
# 1. Reset database with new migration and seeds
yarn supabase db reset

# 2. Start development server
yarn dev

# 3. Visit http://localhost:3000/insights
```

## What Changed

### Before (Mocked Data)
- 90 mock articles generated in-memory from `mockInsights` array
- No database persistence
- Hard-coded content in `data.ts`
- Client-side filtering and pagination

### After (Supabase Backend)
- Real database tables: `articles`, `tags`, `article_tags`
- Server-side data fetching with service role client
- Full-text search via PostgreSQL tsvector
- **All 90 seed articles** generated from the exact mock data structure
- 8 prioritized articles: article-1, article-3, article-10, article-25, article-40, article-55, article-70, article-85
- Future-ready for AI article merge via `prioritized` flag

## Database Schema

### Tables

**articles**
- Core article entity matching UI needs
- Fields: slug, title, description, image, category, read_time, author fields, published_at, content (jsonb), prioritized
- RLS enabled with public read access
- Indexed for slug, category, prioritized+date ordering, and full-text search

**tags**
- Tag definitions: name, slug
- Three category-based tags: Tech & Dev, Team & Workflow, Company news
- Each tag maps 1:1 to an article category
- RLS enabled with public read access

**article_tags**
- Many-to-many junction: article_id, tag_id
- Each article is linked to exactly one tag (its category)
- RLS enabled with public read access

### Key Features

1. **Full-Text Search**
   - `search_vector` column with GIN index
   - Searches over title (weight A) + description (weight B)
   - Automatically updated via generated column

2. **Prioritized Flag**
   - Boolean column (default false)
   - Orders queries: `prioritized DESC, published_at DESC`
   - Ensures DB articles rank above future AI-sourced articles

3. **RLS Security**
   - Restrictive `"require secure session"` policy on all tables
   - Service role bypasses RLS for server-side queries
   - Anon/authenticated have read-only access

## Testing Checklist

### 1. Migration & Seeds

```bash
# Reset database (applies migration + runs all seeds)
yarn supabase db reset

# Verify tables exist
yarn supabase db diff

# Check article count
psql -h localhost -p 54322 -U postgres -d postgres -c "SELECT COUNT(*) FROM articles;"
# Expected: 90

# Check prioritized count
psql -h localhost -p 54322 -U postgres -d postgres -c "SELECT COUNT(*) FROM articles WHERE prioritized = true;"
# Expected: 8
```

### 2. Insights List Page

**URL:** http://localhost:3000/insights

- [ ] Page loads with 6 articles (on desktop)
- [ ] Tabs work: All / Tech & Dev / Team & Workflow / Company news
- [ ] Search works (try "friction", "honeycomb", "buzz")
- [ ] Pagination works (should have 15 pages for "All")
- [ ] Loading state appears during navigation
- [ ] No console errors

**Expected Counts by Category:**
- All: 90 articles (15 pages)
- Tech & Dev: 30 articles (5 pages)
- Team & Workflow: 30 articles (5 pages)
- Company news: 30 articles (5 pages)

### 3. Article Detail Page

**URL:** http://localhost:3000/insights/article-3

- [ ] Article loads: "Behind the Buzz: How We Built Our Latest Feature..."
- [ ] Category badge shows "Company news"
- [ ] Author info displays correctly
- [ ] Content blocks render (text, quote, conclusion)
- [ ] "More Insights" section shows 3 related articles
- [ ] No console errors

**Try other slugs:**
- http://localhost:3000/insights/article-1 (prioritized, Tech & Dev)
- http://localhost:3000/insights/article-10 (prioritized, Tech & Dev)
- http://localhost:3000/insights/article-25 (prioritized, Tech & Dev)
- http://localhost:3000/insights/article-50 (non-prioritized, Team & Workflow)

### 4. Search & Filtering

**Search Queries:**
- "friction" → Should find "Building Without Friction" articles
- "honeycomb" → Should find "The Honeycomb Structure" articles
- "buzz" → Should find "Behind the Buzz" articles (article-3, etc.)
- "gibberish" → Should show "No articles found" message

**Tab + Search Combo:**
- Select "Tech & Dev" tab
- Search "architecture"
- Should show only Tech & Dev articles matching search

### 5. Prioritized Ordering

**Check database:**
```sql
SELECT title, prioritized, published_at 
FROM articles 
ORDER BY prioritized DESC, published_at DESC 
LIMIT 5;
```

**Expected (on "All" tab):**
1. article-85: Mastering Remote Collaboration - Volume 15 (prioritized, 2024-03-25)
2. article-70: Exploring the Future of Frontend Frameworks - Volume 12 (prioritized, 2024-03-10)
3. article-55: Soft Bee Expands to New Office - Volume 10 (prioritized, 2024-02-24)
4. article-40: Exploring the Future of Frontend Frameworks - Volume 7 (prioritized, 2024-02-09)
5. article-25: Behind the Buzz - Volume 5 (prioritized, 2024-01-25)
6. article-10: Exploring the Future of Frontend Frameworks - Volume 2 (prioritized, 2024-01-10)
7. article-3: Behind the Buzz (prioritized, 2024-01-03)
8. article-1: Building Without Friction (prioritized, 2024-01-01)

### 6. Performance

- [ ] Initial page load < 2s
- [ ] Tab switch smooth (< 300ms loading state)
- [ ] Search responsive (< 500ms)
- [ ] No N+1 query issues (check Supabase logs)

## Troubleshooting

### "Table does not exist" errors

```bash
# Check if migration was applied
yarn supabase migration list

# Re-apply migrations
yarn supabase migration up

# Or full reset
yarn supabase db reset
```

### Empty articles list

```bash
# Check if seeds ran
psql -h localhost -p 54322 -U postgres -d postgres -c "SELECT COUNT(*) FROM articles;"

# Re-run seeds
yarn supabase db seed
```

### Type errors after schema changes

```bash
# Regenerate TypeScript types
yarn sb:db:types

# Verify supabaseSchema.ts was updated
git diff src/types/supabaseSchema.ts
```

### Supabase not running

```bash
# Start Supabase
yarn supabase start

# Check status
yarn supabase status

# View logs
yarn supabase logs
```

## Development Workflow

### Adding New Articles

**Via Seed File:**

Edit `supabase/seeds/2_insights_articles.sql` directly (tags, articles, and article_tags). Then run `yarn supabase db reset`.

**Via Supabase Studio:**
1. Open http://localhost:54323
2. Navigate to Table Editor → articles
3. Insert new row (ensure slug is unique)
4. Add tags via article_tags table

**Via SQL:**
```sql
INSERT INTO articles (slug, title, description, image, category, read_time, author_name, author_role, author_image, published_at, prioritized, content)
VALUES (
  'new-article-slug',
  'Article Title',
  'Article description',
  '/images/services/services-img-1.webp',
  'Tech & Dev',
  '5 min read',
  'Author Name',
  'Role',
  '/images/articles/article-author-img-1.webp',
  NOW(),
  true,
  '[]'::jsonb
);
```

### Modifying Schema

1. Create new migration:
   ```bash
   yarn supabase migration new update_articles
   ```

2. Edit the migration file in `supabase/migrations/`

3. Apply migration:
   ```bash
   yarn supabase migration up
   ```

4. Regenerate types:
   ```bash
   yarn sb:db:types
   ```

5. Update API if schema changed:
   - `src/lib/api/articles/server.ts` (queries)
   - `src/lib/api/articles/transform.ts` (mapping)
   - `src/types/supabaseSchema.ts` (types)

## API Reference

### Server-Side Functions

**`getArticles(params?)`**
```typescript
import { getArticles } from '@/lib/api/articles';

const result = await getArticles({
  category: 'Tech & Dev',  // optional: filter by category
  searchQuery: 'architecture',  // optional: full-text search
  page: 1,  // default: 1
  pageSize: 6  // default: 6
});

// Returns:
// {
//   articles: ArticleWithTags[],
//   total: number,
//   page: number,
//   pageSize: number,
//   totalPages: number
// }
```

**`getArticleBySlug(slug)`**
```typescript
import { getArticleBySlug } from '@/lib/api/articles';

const article = await getArticleBySlug('article-3');
// Returns: ArticleWithTags | null
```

**`getMoreArticles(excludeSlug, limit?)`**
```typescript
import { getMoreArticles } from '@/lib/api/articles';

const moreArticles = await getMoreArticles('article-3', 3);
// Returns: ArticleWithTags[]
```

### Transform Helpers

```typescript
import { transformArticleToInsight, transformArticlesToInsights } from '@/lib/api/articles/transform';

// Single article
const insight = transformArticleToInsight(articleWithTags);

// Multiple articles
const insights = transformArticlesToInsights(articlesWithTags);
```

## Future Enhancements

### Tag Filtering UI
The database has category-based tags (Tech & Dev, Team & Workflow, Company news) that map 1:1 to article categories.

Currently, tag filtering is implemented via the category tab system. To add additional tag types:

1. Expand `tags` table with new tags beyond categories
2. Update seed to link articles to multiple tags
3. Add tag filter UI (e.g., dropdown or chips)
4. Update `getArticles` to support tag filtering alongside category

### Admin CRUD
Currently articles can only be managed via:
- Direct database access
- Supabase Studio
- Seed files

To add admin UI:
1. Create authenticated routes under `/dashboard/articles`
2. Add server actions for create/update/delete
3. Build forms using existing shadcn components
4. Restrict access via RLS policies for admin role

### AI Article Merge
When integrating external AI articles API:

1. Fetch AI articles from external API
2. Fetch prioritized DB articles: `WHERE prioritized = true`
3. Merge results:
   ```typescript
   const merged = [
     ...dbArticles.filter(a => a.prioritized),
     ...aiArticles,
     ...dbArticles.filter(a => !a.prioritized)
   ].slice(0, limit);
   ```

4. Sort final list: `prioritized DESC, published_at DESC`

This ensures prioritized DB articles always rank first.

## Resources

- **PR:** https://github.com/yuramol/soft-bee-landing/pull/69
- **Migration:** `supabase/migrations/20260923100451_create_articles.sql`
- **Seeds:** `supabase/seeds/2_insights_articles.sql`
- **API:** `src/lib/api/articles/`
- **UI:** `src/components/sections/insights/`

## Questions?

- Check the PR description for detailed changes
- Review migration SQL for schema details
- Inspect seed data for article structure examples
- Test in Supabase Studio: http://localhost:54323
