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
      searchQuery: params.searchQuery ?? ''
    }
  ] as const;
}

function isSameArticlesParams(a: FetchArticlesParams, b: FetchArticlesParams): boolean {
  return (a.category ?? '') === (b.category ?? '') && (a.searchQuery ?? '') === (b.searchQuery ?? '');
}

export function useArticlesQuery({ category, searchQuery = '', initialData, initialParams }: UseArticlesQueryParams) {
  const params: FetchArticlesParams = { category, searchQuery };

  const matchesInitialData = initialData !== undefined && initialParams !== undefined && isSameArticlesParams(params, initialParams);

  return useQuery({
    queryKey: articlesQueryKey(params),
    queryFn: () => fetchArticles(params),
    initialData: matchesInitialData ? initialData : undefined,
    placeholderData: (previousData) => previousData,
    staleTime: 30_000
  });
}
