import type { InsightArticle } from '@/components/sections/insights/insights-list/data';

export interface RankedInsight {
  article: InsightArticle;
  prioritized: boolean;
  publishedAtMs: number;
}

/**
 * Prioritized DB articles first, then everything else by published date (desc).
 * AI news is never prioritized. Duplicate slugs prefer the DB/prioritized entry.
 */
export function mergeRankedInsights(dbArticles: RankedInsight[], aiArticles: RankedInsight[]): InsightArticle[] {
  const sorted = [...dbArticles, ...aiArticles].sort((a, b) => {
    if (a.prioritized !== b.prioritized) {
      return a.prioritized ? -1 : 1;
    }
    return b.publishedAtMs - a.publishedAtMs;
  });

  const seenSlugs = new Set<string>();
  const merged: InsightArticle[] = [];

  for (const entry of sorted) {
    if (seenSlugs.has(entry.article.slug)) {
      continue;
    }
    seenSlugs.add(entry.article.slug);
    merged.push(entry.article);
  }

  return merged;
}

export function filterInsightsBySearch(articles: InsightArticle[], searchQuery: string): InsightArticle[] {
  const trimmed = searchQuery.trim().toLowerCase();
  if (!trimmed) return articles;

  return articles.filter((article) => {
    return article.title.toLowerCase().includes(trimmed) || article.description.toLowerCase().includes(trimmed);
  });
}

export function paginateInsights(
  articles: InsightArticle[],
  page: number,
  pageSize: number
): { articles: InsightArticle[]; total: number; page: number; pageSize: number; totalPages: number } {
  const safePage = page > 0 ? page : 1;
  const safePageSize = pageSize > 0 ? pageSize : 6;
  const total = articles.length;
  const start = (safePage - 1) * safePageSize;

  return {
    articles: articles.slice(start, start + safePageSize),
    total,
    page: safePage,
    pageSize: safePageSize,
    totalPages: Math.ceil(total / safePageSize) || 0
  };
}

export function publishedAtToMs(iso: string): number {
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? ms : 0;
}
