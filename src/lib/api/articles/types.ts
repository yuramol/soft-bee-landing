import type { Database } from '@/types';
import type { InsightArticle } from '@/components/sections/insights/insights-list/data';

export type ArticleRow = Database['public']['Tables']['articles']['Row'];
export type TagRow = Database['public']['Tables']['tags']['Row'];

export interface ArticlesListResponse {
  articles: InsightArticle[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  /** True when Soft Bee News (Tech & Dev) was requested but the archive API failed. */
  newsUnavailable?: boolean;
}

export interface FetchArticlesParams {
  category?: string;
  searchQuery?: string;
  page?: number;
  pageSize?: number;
}

export const ARTICLES_PAGE_SIZE_MOBILE = 3;
export const ARTICLES_PAGE_SIZE_DESKTOP = 3;
/** Hard cap for Insights list pageSize (SSR + /api/insights). */
export const ARTICLES_PAGE_SIZE_MAX = 24;
