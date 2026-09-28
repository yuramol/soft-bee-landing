import { describe, expect, it } from 'vitest';

import type { InsightArticle } from '@/components/sections/insights/insights-list/data';

import { clampArticlesPageSize, filterInsightsBySearch, mergeRankedInsights, paginateInsights, type RankedInsight } from './merge';

function article(partial: Partial<InsightArticle> & Pick<InsightArticle, 'slug' | 'title'>): InsightArticle {
  return {
    id: partial.id ?? partial.slug,
    image: partial.image ?? '/img.webp',
    category: partial.category ?? 'Tech & Dev',
    readTime: partial.readTime ?? '5 min read',
    title: partial.title,
    description: partial.description ?? 'desc',
    slug: partial.slug,
    authorName: partial.authorName ?? 'Author',
    authorRole: partial.authorRole ?? 'Role',
    authorImage: partial.authorImage ?? '/author.webp',
    date: partial.date ?? '01.01.2026',
    content: partial.content ?? [],
    source: partial.source
  };
}

function ranked(entry: { slug: string; title: string; prioritized: boolean; publishedAtMs: number; source?: 'db' | 'ai' }): RankedInsight {
  return {
    article: article({ slug: entry.slug, title: entry.title, source: entry.source }),
    prioritized: entry.prioritized,
    publishedAtMs: entry.publishedAtMs
  };
}

describe('mergeRankedInsights', () => {
  it('uses three tiers: prioritized DB → AI → remaining DB', () => {
    const merged = mergeRankedInsights(
      [
        ranked({ slug: 'db-fresh', title: 'Fresh DB', prioritized: false, publishedAtMs: 300, source: 'db' }),
        ranked({ slug: 'db-prio', title: 'Prio DB', prioritized: true, publishedAtMs: 50, source: 'db' })
      ],
      [ranked({ slug: 'ai-mid', title: 'AI Mid', prioritized: false, publishedAtMs: 200, source: 'ai' })]
    );

    // Non-prio DB is newer than AI, but AI still ranks in the middle tier.
    expect(merged.map((item) => item.slug)).toEqual(['db-prio', 'ai-mid', 'db-fresh']);
  });

  it('dedupes by slug preferring prioritized DB over AI', () => {
    const merged = mergeRankedInsights(
      [ranked({ slug: 'same', title: 'DB', prioritized: true, publishedAtMs: 10, source: 'db' })],
      [ranked({ slug: 'same', title: 'AI', prioritized: false, publishedAtMs: 99, source: 'ai' })]
    );

    expect(merged).toHaveLength(1);
    expect(merged[0]?.title).toBe('DB');
  });

  it('dedupes by slug preferring AI over non-prioritized DB', () => {
    const merged = mergeRankedInsights(
      [ranked({ slug: 'same', title: 'DB', prioritized: false, publishedAtMs: 10, source: 'db' })],
      [ranked({ slug: 'same', title: 'AI', prioritized: false, publishedAtMs: 99, source: 'ai' })]
    );

    expect(merged).toHaveLength(1);
    expect(merged[0]?.title).toBe('AI');
  });
});

describe('filterInsightsBySearch / paginateInsights / clampArticlesPageSize', () => {
  it('filters by title or description', () => {
    const items = [
      article({ slug: 'a', title: 'Honeycomb APIs', description: 'scale' }),
      article({ slug: 'b', title: 'Other', description: 'buzzwords' })
    ];

    expect(filterInsightsBySearch(items, 'honey').map((item) => item.slug)).toEqual(['a']);
    expect(filterInsightsBySearch(items, 'buzz').map((item) => item.slug)).toEqual(['b']);
  });

  it('paginates results', () => {
    const items = [1, 2, 3, 4, 5].map((n) => article({ slug: `s-${n}`, title: `T${n}` }));
    const page = paginateInsights(items, 2, 2);
    expect(page.articles.map((item) => item.slug)).toEqual(['s-3', 's-4']);
    expect(page.total).toBe(5);
    expect(page.totalPages).toBe(3);
  });

  it('clamps page size', () => {
    expect(clampArticlesPageSize(999, 6, 24)).toBe(24);
    expect(clampArticlesPageSize(0, 6, 24)).toBe(6);
    expect(clampArticlesPageSize(3, 6, 24)).toBe(3);
  });
});
