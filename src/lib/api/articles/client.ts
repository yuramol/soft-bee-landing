import { createBrowserClient } from '@/utils/supabase/client';
import { buildArticlesSearchOrFilter } from './search';
import { transformArticlesToInsights } from './transform';
import { ARTICLES_PAGE_SIZE_DESKTOP, toArticleWithTags, type ArticlesListResponse, type FetchArticlesParams } from './types';

/**
 * Client-side fetch for paginated Insights articles via anon Supabase (RLS public select).
 */
export async function fetchArticles(params: FetchArticlesParams = {}): Promise<ArticlesListResponse> {
  const { category, searchQuery, page = 1, pageSize = ARTICLES_PAGE_SIZE_DESKTOP } = params;
  const supabase = createBrowserClient();

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

  const articles = (data ?? []).map((article) => toArticleWithTags(article));
  const total = count ?? 0;

  return {
    articles: transformArticlesToInsights(articles),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  };
}
