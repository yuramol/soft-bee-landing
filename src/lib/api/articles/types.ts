import type { Database } from '@/types';
import type { InsightArticle } from '@/components/sections/insights/insights-list/data';

export type ArticleRow = Database['public']['Tables']['articles']['Row'];
export type TagRow = Database['public']['Tables']['tags']['Row'];

export interface ArticlesListResponse {
  articles: InsightArticle[];
  /** True when Soft Bee News (Tech & Dev) was requested but the archive API failed. */
  newsUnavailable?: boolean;
}

export interface FetchArticlesParams {
  category?: string;
  searchQuery?: string;
}

/**
 * Maximum number of articles to display per tab or search result.
 * Prioritized DB articles rank first, then newest items (DB + API merged).
 */
export const INSIGHTS_DISPLAY_LIMIT = 3;
