import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/types';
import { buildArticlesSearchOrFilter } from './search';
import type { ArticleRow, FetchArticlesParams } from './types';
import { ARTICLES_PAGE_SIZE_DESKTOP } from './types';

export interface ArticlesListQueryResult {
  articles: ArticleRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

type ArticlesSupabaseClient = SupabaseClient<Database>;

/**
 * Shared list query for server + browser anon clients.
 */
export async function queryArticlesList(
  supabase: ArticlesSupabaseClient,
  params: FetchArticlesParams = {}
): Promise<ArticlesListQueryResult> {
  const { category, searchQuery, page = 1, pageSize = ARTICLES_PAGE_SIZE_DESKTOP } = params;

  let query = supabase
    .from('articles')
    .select('*', { count: 'exact' })
    .order('prioritized', { ascending: false })
    .order('published_at', { ascending: false });

  if (category && category !== 'All') {
    query = query.eq('category', category);
  }

  const searchFilter = searchQuery ? buildArticlesSearchOrFilter(searchQuery) : null;
  if (searchFilter) {
    query = query.or(searchFilter);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message || 'Failed to fetch articles');
  }

  const total = count ?? 0;

  return {
    articles: data ?? [],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  };
}
