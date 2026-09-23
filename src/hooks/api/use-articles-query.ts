'use client';

import { useQuery } from '@tanstack/react-query';

import { fetchArticles } from '@/lib/api/articles/client';
import { ARTICLES_PAGE_SIZE_DESKTOP, type ArticlesListResponse, type FetchArticlesParams } from '@/lib/api/articles/types';

export interface UseArticlesQueryParams extends FetchArticlesParams {
  initialData?: ArticlesListResponse;
  /** SSR snapshot — initialData is used only while current params still match this. */
  initialParams?: FetchArticlesParams;
}

export function articlesQueryKey(params: FetchArticlesParams) {
  return [
    'articles',
    {
      category: params.category ?? '',
      searchQuery: params.searchQuery ?? '',
      page: params.page ?? 1,
      pageSize: params.pageSize ?? ARTICLES_PAGE_SIZE_DESKTOP
    }
  ] as const;
}

function isSameArticlesParams(a: FetchArticlesParams, b: FetchArticlesParams): boolean {
  return (
    (a.category ?? '') === (b.category ?? '') &&
    (a.searchQuery ?? '') === (b.searchQuery ?? '') &&
    (a.page ?? 1) === (b.page ?? 1) &&
    (a.pageSize ?? ARTICLES_PAGE_SIZE_DESKTOP) === (b.pageSize ?? ARTICLES_PAGE_SIZE_DESKTOP)
  );
}

export function useArticlesQuery({
  category,
  searchQuery = '',
  page = 1,
  pageSize = ARTICLES_PAGE_SIZE_DESKTOP,
  initialData,
  initialParams
}: UseArticlesQueryParams) {
  const params: FetchArticlesParams = { category, searchQuery, page, pageSize };

  const matchesInitialData = initialData !== undefined && initialParams !== undefined && isSameArticlesParams(params, initialParams);

  return useQuery({
    queryKey: articlesQueryKey(params),
    queryFn: () => fetchArticles(params),
    initialData: matchesInitialData ? initialData : undefined,
    placeholderData: (previousData) => previousData,
    staleTime: 30_000
  });
}
