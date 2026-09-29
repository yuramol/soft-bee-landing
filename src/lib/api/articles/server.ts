import type { InsightArticle } from '@/components/sections/insights/insights-list/data';
import { createServerClient } from '@/utils/supabase/server';
import {
  AI_INSIGHTS_CATEGORY,
  NEWS_ARCHIVE_LIST_LIMIT,
  NEWS_DEFAULT_LANGUAGE,
  NEWS_MERGE_DB_FETCH_LIMIT,
  NewsApiError,
  getNewsArticle,
  isNewsConfigured,
  listNewsArticles,
  transformNewsArticleToInsight,
  transformNewsCardToInsight
} from '@/lib/news';

import {
  filterInsightsBySearch,
  mergeRankedInsights,
  paginateInsights,
  publishedAtToMs,
  clampArticlesPageSize,
  type RankedInsight
} from './merge';
import { queryArticlesList } from './query';
import { transformArticleToInsight } from './transform';
import type { ArticleRow, ArticlesListResponse, FetchArticlesParams, TagRow } from './types';
import { ARTICLES_PAGE_SIZE_DESKTOP, ARTICLES_PAGE_SIZE_MAX } from './types';

export type GetArticlesParams = FetchArticlesParams;

export type GetArticlesResult = ArticlesListResponse;

/**
 * Fetch all article category tags ordered by creation (seed insert order).
 */
export async function getTags(): Promise<TagRow[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase.from('tags').select('*').order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message || 'Failed to fetch tags');
  }

  return data ?? [];
}

/**
 * Merged Insights feed (three tiers):
 * prioritized DB → Soft Bee News (Tech & Dev) → remaining DB, each by published date.
 * Soft Bee News is read-only (service generates on its own); archive is cached ~1 day.
 */
export async function getArticles(params: GetArticlesParams = {}): Promise<GetArticlesResult> {
  const page = params.page ?? 1;
  const pageSize = clampArticlesPageSize(params.pageSize ?? ARTICLES_PAGE_SIZE_DESKTOP, ARTICLES_PAGE_SIZE_DESKTOP, ARTICLES_PAGE_SIZE_MAX);
  const merged = await getMergedInsights({
    category: params.category,
    searchQuery: params.searchQuery
  });
  return paginateInsights(merged, page, pageSize);
}

/**
 * Resolve an insight by slug with the same tier preference as the merged list:
 * prioritized DB → Soft Bee News → remaining DB.
 * Non-404 Soft Bee News failures propagate (do not masquerade as missing articles).
 */
export async function getInsightBySlug(slug: string): Promise<InsightArticle | null> {
  const dbArticle = await getArticleBySlug(slug);

  if (dbArticle?.prioritized) {
    return transformArticleToInsight(dbArticle);
  }

  if (isNewsConfigured()) {
    try {
      const newsArticle = await getNewsArticle(slug, NEWS_DEFAULT_LANGUAGE);
      return transformNewsArticleToInsight(newsArticle);
    } catch (error) {
      if (!(error instanceof NewsApiError && error.status === 404)) {
        throw error;
      }
    }
  }

  if (dbArticle) {
    return transformArticleToInsight(dbArticle);
  }

  return null;
}

/**
 * Fetch a single DB article by slug.
 */
export async function getArticleBySlug(slug: string): Promise<ArticleRow | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).maybeSingle();

  if (error) {
    throw new Error(error.message || 'Failed to fetch article by slug');
  }

  return data;
}

/**
 * More Insights: full merged feed excluding the current slug (not limited by list pageSize).
 */
export async function getMoreArticles(excludeSlug: string, limit = 3): Promise<InsightArticle[]> {
  const merged = await getMergedInsights({});
  return merged.filter((article) => article.slug !== excludeSlug).slice(0, limit);
}

async function getMergedInsights(params: { category?: string; searchQuery?: string } = {}): Promise<InsightArticle[]> {
  const searchQuery = params.searchQuery?.trim() ?? '';
  const category = params.category;

  const [dbRows, aiRanked] = await Promise.all([fetchDbArticlesForMerge(category), fetchAiRankedForMerge(category)]);

  let rankedDb = toRankedDbInsights(dbRows);
  let rankedAi = aiRanked;

  if (searchQuery) {
    const filtered = filterInsightsBySearch(
      [...rankedDb, ...rankedAi].map((entry) => entry.article),
      searchQuery
    );
    const allowed = new Set(filtered.map((article) => article.slug));
    rankedDb = rankedDb.filter((entry) => allowed.has(entry.article.slug));
    rankedAi = rankedAi.filter((entry) => allowed.has(entry.article.slug));
  }

  return mergeRankedInsights(rankedDb, rankedAi);
}

async function fetchDbArticlesForMerge(category: string | undefined): Promise<ArticleRow[]> {
  const supabase = await createServerClient();
  const result = await queryArticlesList(supabase, {
    category,
    page: 1,
    pageSize: NEWS_MERGE_DB_FETCH_LIMIT
  });
  return result.articles;
}

async function fetchAiRankedForMerge(category: string | undefined): Promise<RankedInsight[]> {
  if (!shouldIncludeAiNews(category) || !isNewsConfigured()) {
    return [];
  }

  try {
    const cards = await listNewsArticles({
      language: NEWS_DEFAULT_LANGUAGE,
      limit: NEWS_ARCHIVE_LIST_LIMIT
    });

    return cards.map((card) => ({
      article: transformNewsCardToInsight(card),
      prioritized: false,
      publishedAtMs: publishedAtToMs(card.publishedAt)
    }));
  } catch (error) {
    console.error('Failed to load Soft Bee News archive:', error);
    return [];
  }
}

function shouldIncludeAiNews(category: string | undefined): boolean {
  if (!category || category === 'All') {
    return true;
  }
  return category === AI_INSIGHTS_CATEGORY;
}

function toRankedDbInsights(rows: ArticleRow[]): RankedInsight[] {
  return rows.map((row) => ({
    article: transformArticleToInsight(row),
    prioritized: row.prioritized,
    publishedAtMs: publishedAtToMs(row.published_at)
  }));
}
