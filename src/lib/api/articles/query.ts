import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/types';
import { buildArticlesSearchOrFilter } from './search';
import type { ArticleRow, FetchArticlesParams } from './types';

export interface ArticlesListQueryResult {
  articles: ArticleRow[];
}

type ArticlesSupabaseClient = SupabaseClient<Database>;

/**
 * Shared list query for server + browser anon clients.
 * Fetches all matching articles (no pagination) for proper search and merge.
 */
export async function queryArticlesList(
  supabase: ArticlesSupabaseClient,
  params: FetchArticlesParams = {}
): Promise<ArticlesListQueryResult> {
  const { category, searchQuery } = params;

  let query = supabase.from('articles').select('*').order('prioritized', { ascending: false }).order('published_at', { ascending: false });

  if (category && category !== 'All') {
    query = query.eq('category', category);
  }

  const searchFilter = searchQuery ? buildArticlesSearchOrFilter(searchQuery) : null;
  if (searchFilter) {
    query = query.or(searchFilter);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message || 'Failed to fetch articles');
  }

  return {
    articles: data ?? []
  };
}
