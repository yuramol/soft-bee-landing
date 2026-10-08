import type { InsightArticle } from '@/components/sections/insights/insights-list/data';

export interface RankedInsight {
  article: InsightArticle;
  prioritized: boolean;
  publishedAtMs: number;
}

/**
 * Three-tier merge:
 * 1. Prioritized DB articles (by published date desc)
 * 2. Soft Bee News / AI articles (by published date desc)
 * 3. Remaining DB articles (by published date desc)
 *
 * AI news is never prioritized. Duplicate slugs prefer the earlier tier entry.
 */
export function mergeRankedInsights(dbArticles: RankedInsight[], aiArticles: RankedInsight[]): InsightArticle[] {
  const byDateDesc = (a: RankedInsight, b: RankedInsight) => b.publishedAtMs - a.publishedAtMs;

  const prioritized = dbArticles.filter((entry) => entry.prioritized).sort(byDateDesc);
  const aiSorted = [...aiArticles].sort(byDateDesc);
  const restDb = dbArticles.filter((entry) => !entry.prioritized).sort(byDateDesc);

  const seenSlugs = new Set<string>();
  const merged: InsightArticle[] = [];

  for (const entry of [...prioritized, ...aiSorted, ...restDb]) {
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

export function publishedAtToMs(iso: string): number {
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? ms : 0;
}
