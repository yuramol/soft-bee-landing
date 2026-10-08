import type { InsightArticle } from '@/components/sections/insights/insights-list/data';

export interface RankedInsight {
  article: InsightArticle;
  prioritized: boolean;
  publishedAtMs: number;
}

/**
 * Two-tier merge:
 * 1. Prioritized DB articles (by published date desc, then slug for deterministic tie-breaking)
 * 2. All remaining items (non-prioritized DB + news/AI articles) merged by published date desc, then slug
 *
 * News/AI articles are never prioritized. Duplicate slugs prefer the earlier tier entry.
 */
export function mergeRankedInsights(dbArticles: RankedInsight[], aiArticles: RankedInsight[]): InsightArticle[] {
  // Deterministic comparator: date desc, then slug asc for stable tie-breaking
  const byDateAndSlug = (a: RankedInsight, b: RankedInsight) => {
    const dateDiff = b.publishedAtMs - a.publishedAtMs;
    if (dateDiff !== 0) return dateDiff;
    return a.article.slug.localeCompare(b.article.slug);
  };

  const prioritized = dbArticles.filter((entry) => entry.prioritized).sort(byDateAndSlug);
  const nonPrioritizedDb = dbArticles.filter((entry) => !entry.prioritized);
  const allRemaining = [...nonPrioritizedDb, ...aiArticles].sort(byDateAndSlug);

  const seenSlugs = new Set<string>();
  const merged: InsightArticle[] = [];

  for (const entry of [...prioritized, ...allRemaining]) {
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
