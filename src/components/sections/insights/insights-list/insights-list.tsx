'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { InsightArticle } from './data';
import { SearchInput } from '@/components/ui/search-input';
import { CustomPagination } from '@/components/ui/custom-pagination';
import { InsightCard, InsightsTabs, type TabItem } from './components';
import { ComponentContainer } from '@/components/layout';
import { Loader } from '@/components/ui/loader';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useWidth } from '@/hooks/use-width';
import { useArticlesQuery } from '@/hooks/api/use-articles-query';
import { isLegacyTabSlug, resolveTabSlug } from '@/lib/api/articles/tab-slug';
import { ARTICLES_PAGE_SIZE_DESKTOP, ARTICLES_PAGE_SIZE_MOBILE, type ArticlesListResponse } from '@/lib/api/articles/types';

const SEARCH_DEBOUNCE_MS = 300;

interface InsightsListProps {
  initialInsights: InsightArticle[];
  initialTotal: number;
  initialPage: number;
  initialPageSize: number;
  initialTab: string;
  initialSearchQuery: string;
  tabs: TabItem[];
}

export function InsightsList({
  initialInsights,
  initialTotal,
  initialPage,
  initialPageSize,
  initialTab,
  initialSearchQuery,
  tabs
}: InsightsListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sectionRef = useRef<HTMLElement>(null);
  const skipSearchUrlCommitRef = useRef(false);
  const { width, isMd } = useWidth();

  const rawTabId = searchParams.get('tab') || initialTab;
  const activeTabId = resolveTabSlug(rawTabId);
  const searchQuery = searchParams.get('q') ?? initialSearchQuery;
  const pageFromUrl = Number.parseInt(searchParams.get('page') ?? '', 10);
  const currentPage = Number.isFinite(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : initialPage;

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const debouncedSearchQuery = useDebouncedValue(localSearchQuery, SEARCH_DEBOUNCE_MS);

  // Until the viewport is measured, keep the SSR page size to avoid a wrong mobile fetch on desktop.
  const pageSize = width === 0 ? initialPageSize : isMd ? ARTICLES_PAGE_SIZE_DESKTOP : ARTICLES_PAGE_SIZE_MOBILE;

  const category = activeTabId === 'all' ? undefined : tabs.find((tab) => tab.id === activeTabId)?.label;
  const initialCategory = initialTab === 'all' ? undefined : tabs.find((tab) => tab.id === initialTab)?.label;

  const initialData = useMemo<ArticlesListResponse>(
    () => ({
      articles: initialInsights,
      total: initialTotal,
      page: initialPage,
      pageSize: initialPageSize,
      totalPages: Math.ceil(initialTotal / initialPageSize) || 0
    }),
    [initialInsights, initialTotal, initialPage, initialPageSize]
  );

  const initialParams = useMemo(
    () => ({
      category: initialCategory,
      searchQuery: initialSearchQuery,
      page: initialPage,
      pageSize: initialPageSize
    }),
    [initialCategory, initialSearchQuery, initialPage, initialPageSize]
  );

  const articlesQuery = useArticlesQuery({
    category,
    searchQuery,
    page: currentPage,
    pageSize,
    initialData,
    initialParams
  });

  const queryArticles = articlesQuery.data?.articles ?? initialInsights;
  // While mobile pageSize (3) is refetching after SSR (6), avoid flashing all 6 cards.
  const paginatedInsights = articlesQuery.isFetching && queryArticles.length > pageSize ? queryArticles.slice(0, pageSize) : queryArticles;
  // Recompute from total + current pageSize so placeholderData from a different pageSize cannot skew pagination.
  const totalPages = Math.ceil((articlesQuery.data?.total ?? initialTotal) / pageSize);
  const isLoading = articlesQuery.isFetching;
  const hasQueryError = articlesQuery.isError;

  // canonicalize legacy ?tab=tech|team|company to current tag slugs
  useEffect(() => {
    if (!isLegacyTabSlug(rawTabId)) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', activeTabId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [rawTabId, activeTabId, searchParams, pathname, router]);

  // keep input in sync when URL search changes (e.g. browser back/forward)
  useEffect(() => {
    skipSearchUrlCommitRef.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // commit debounced search to the URL so each keystroke does not hit the server
  useEffect(() => {
    if (skipSearchUrlCommitRef.current) {
      skipSearchUrlCommitRef.current = false;
      return;
    }

    if (debouncedSearchQuery === searchQuery) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearchQuery) {
      params.set('q', debouncedSearchQuery);
    } else {
      params.delete('q');
    }
    params.set('page', '1');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [debouncedSearchQuery, searchQuery, searchParams, pathname, router]);

  function updateParams(newParams: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function scrollToTop() {
    if (sectionRef.current) {
      const offsetTop = sectionRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: offsetTop - 100, behavior: 'smooth' });
    }
  }

  function handleTabClick(tabId: string) {
    updateParams({ tab: tabId === 'all' ? null : tabId, page: '1' });
    scrollToTop();
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLocalSearchQuery(e.target.value);
  }

  function handlePageChange(page: number) {
    updateParams({ page: page.toString() });
    scrollToTop();
  }

  return (
    <section ref={sectionRef} className='z-20 bg-transparent px-4 pt-2.5 md:pt-8.75 lg:px-10.5'>
      <ComponentContainer>
        <div className='mb-2.5 flex flex-col items-start justify-between gap-6 md:mb-8.75 md:flex-row'>
          <InsightsTabs tabs={tabs} activeTabId={activeTabId} onTabChange={handleTabClick} />

          <SearchInput placeholder='Search' wrapperClassName='w-full md:w-83.75' value={localSearchQuery} onChange={handleSearchChange} />
        </div>

        <div className='relative mb-5 md:mb-10'>
          {hasQueryError ? (
            <div className='col-span-full py-12 text-center text-gray-500'>Could not load articles. Please try again.</div>
          ) : (
            <>
              <div
                className={`grid grid-cols-1 gap-2.5 transition-opacity duration-300 md:grid-cols-2 xl:grid-cols-3 ${
                  isLoading ? 'pointer-events-none opacity-50' : 'opacity-100'
                }`}
              >
                {paginatedInsights.map((article) => (
                  <InsightCard key={article.id} article={article} />
                ))}
                {paginatedInsights.length === 0 && !isLoading && (
                  <div className='col-span-full py-12 text-center text-gray-500'>No articles found matching your criteria.</div>
                )}
              </div>

              {isLoading && (
                <div className='absolute inset-0 z-10 flex items-start justify-center pt-[25%]'>
                  <Loader className='text-brand-black h-12 w-12' />
                </div>
              )}
            </>
          )}
        </div>

        {!hasQueryError && (
          <div
            className={`transition-opacity duration-300 ${isLoading ? 'pointer-events-none invisible opacity-0' : 'visible opacity-100'}`}
          >
            <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        )}
      </ComponentContainer>
    </section>
  );
}
