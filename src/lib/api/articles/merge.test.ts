import { describe, expect, it } from 'vitest';

import type { InsightArticle } from '@/components/sections/insights/insights-list/data';

import { filterInsightsBySearch, mergeRankedInsights, type RankedInsight } from './merge';

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
  it('uses two tiers: prioritized DB → all remaining (non-prioritized DB + AI) by date', () => {
    const merged = mergeRankedInsights(
      [
        ranked({ slug: 'db-fresh', title: 'Fresh DB', prioritized: false, publishedAtMs: 300, source: 'db' }),
        ranked({ slug: 'db-prio', title: 'Prio DB', prioritized: true, publishedAtMs: 50, source: 'db' })
      ],
      [ranked({ slug: 'ai-mid', title: 'AI Mid', prioritized: false, publishedAtMs: 200, source: 'ai' })]
    );

    // Non-prio DB (300) is newer than AI (200), so it comes first in tier 2
    expect(merged.map((item) => item.slug)).toEqual(['db-prio', 'db-fresh', 'ai-mid']);
  });

  it('sorts within tiers by date desc, then slug for deterministic tie-breaking', () => {
    const merged = mergeRankedInsights(
      [
        ranked({ slug: 'db-b', title: 'B', prioritized: false, publishedAtMs: 100, source: 'db' }),
        ranked({ slug: 'db-a', title: 'A', prioritized: false, publishedAtMs: 100, source: 'db' })
      ],
      [ranked({ slug: 'ai-c', title: 'C', prioritized: false, publishedAtMs: 100, source: 'ai' })]
    );

    // Same date: sorted by slug alphabetically
    expect(merged.map((item) => item.slug)).toEqual(['ai-c', 'db-a', 'db-b']);
  });

  it('dedupes by slug preferring prioritized DB over AI', () => {
    const merged = mergeRankedInsights(
      [ranked({ slug: 'same', title: 'DB', prioritized: true, publishedAtMs: 10, source: 'db' })],
      [ranked({ slug: 'same', title: 'AI', prioritized: false, publishedAtMs: 99, source: 'ai' })]
    );

    expect(merged).toHaveLength(1);
    expect(merged[0]?.title).toBe('DB');
  });

  it('dedupes by slug preferring first occurrence in tier 2 (non-prioritized)', () => {
    const merged = mergeRankedInsights(
      [ranked({ slug: 'same', title: 'DB', prioritized: false, publishedAtMs: 50, source: 'db' })],
      [ranked({ slug: 'same', title: 'AI', prioritized: false, publishedAtMs: 99, source: 'ai' })]
    );

    // AI has newer date, so it appears first in tier 2 and wins
    expect(merged).toHaveLength(1);
    expect(merged[0]?.title).toBe('AI');
  });

  it('prioritized items always appear first regardless of date', () => {
    const merged = mergeRankedInsights(
      [
        ranked({ slug: 'old-prio', title: 'Old Prio', prioritized: true, publishedAtMs: 1, source: 'db' }),
        ranked({ slug: 'new-db', title: 'New DB', prioritized: false, publishedAtMs: 1000, source: 'db' })
      ],
      [ranked({ slug: 'new-ai', title: 'New AI', prioritized: false, publishedAtMs: 2000, source: 'ai' })]
    );

    // Even though old-prio is ancient, it's prioritized so it comes first
    expect(merged.map((item) => item.slug)).toEqual(['old-prio', 'new-ai', 'new-db']);
  });
});

describe('filterInsightsBySearch', () => {
  it('filters by title or description', () => {
    const items = [
      article({ slug: 'a', title: 'Honeycomb APIs', description: 'scale' }),
      article({ slug: 'b', title: 'Other', description: 'buzzwords' })
    ];

    expect(filterInsightsBySearch(items, 'honey').map((item) => item.slug)).toEqual(['a']);
    expect(filterInsightsBySearch(items, 'buzz').map((item) => item.slug)).toEqual(['b']);
  });

  it('returns all items when search query is empty', () => {
    const items = [article({ slug: 'a', title: 'First' }), article({ slug: 'b', title: 'Second' })];

    expect(filterInsightsBySearch(items, '').map((item) => item.slug)).toEqual(['a', 'b']);
    expect(filterInsightsBySearch(items, '   ').map((item) => item.slug)).toEqual(['a', 'b']);
  });
});
