'use client';

import { useQuery } from '@tanstack/react-query';

import { fetchArticles } from '@/lib/api/articles/client';
import type { ArticlesListResponse, FetchArticlesParams } from '@/lib/api/articles/types';

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
      pageSize: params.pageSize ?? 6
    }
  ] as const;
}

function isSameArticlesParams(a: FetchArticlesParams, b: FetchArticlesParams): boolean {
  return (
    (a.category ?? '') === (b.category ?? '') &&
    (a.searchQuery ?? '') === (b.searchQuery ?? '') &&
    (a.page ?? 1) === (b.page ?? 1) &&
    (a.pageSize ?? 6) === (b.pageSize ?? 6)
  );
}

export function useArticlesQuery({
  category,
  searchQuery = '',
  page = 1,
  pageSize = 6,
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
