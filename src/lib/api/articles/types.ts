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
}

export interface FetchArticlesParams {
  category?: string;
  searchQuery?: string;
  page?: number;
  pageSize?: number;
}

export const ARTICLES_PAGE_SIZE_MOBILE = 3;
export const ARTICLES_PAGE_SIZE_DESKTOP = 6;
