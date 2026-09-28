import { describe, expect, it } from 'vitest';

import type { InsightArticle } from '@/components/sections/insights/insights-list/data';

import { filterInsightsBySearch, mergeRankedInsights, paginateInsights, type RankedInsight } from './merge';

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
  it('ranks prioritized DB articles above AI and non-prioritized DB', () => {
    const merged = mergeRankedInsights(
      [
        ranked({ slug: 'db-old', title: 'Old DB', prioritized: false, publishedAtMs: 100, source: 'db' }),
        ranked({ slug: 'db-prio', title: 'Prio DB', prioritized: true, publishedAtMs: 50, source: 'db' })
      ],
      [ranked({ slug: 'ai-new', title: 'AI New', prioritized: false, publishedAtMs: 200, source: 'ai' })]
    );

    expect(merged.map((item) => item.slug)).toEqual(['db-prio', 'ai-new', 'db-old']);
  });

  it('dedupes by slug preferring the earlier sorted entry (prioritized/db)', () => {
    const merged = mergeRankedInsights(
      [ranked({ slug: 'same', title: 'DB', prioritized: true, publishedAtMs: 10, source: 'db' })],
      [ranked({ slug: 'same', title: 'AI', prioritized: false, publishedAtMs: 99, source: 'ai' })]
    );

    expect(merged).toHaveLength(1);
    expect(merged[0]?.title).toBe('DB');
  });
});

describe('filterInsightsBySearch / paginateInsights', () => {
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
});
