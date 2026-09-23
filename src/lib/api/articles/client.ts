import { createBrowserClient } from '@/utils/supabase/client';
import { queryArticlesList } from './query';
import { transformArticlesToInsights } from './transform';
import { ARTICLES_PAGE_SIZE_DESKTOP, type ArticlesListResponse, type FetchArticlesParams } from './types';

/**
 * Client-side fetch for paginated Insights articles via anon Supabase (RLS public select).
 */
export async function fetchArticles(params: FetchArticlesParams = {}): Promise<ArticlesListResponse> {
  const supabase = createBrowserClient();
  const result = await queryArticlesList(supabase, {
    ...params,
    pageSize: params.pageSize ?? ARTICLES_PAGE_SIZE_DESKTOP
  });

  return {
    articles: transformArticlesToInsights(result.articles),
    total: result.total,
    page: result.page,
    pageSize: result.pageSize,
    totalPages: result.totalPages
  };
}
