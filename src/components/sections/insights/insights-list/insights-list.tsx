'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { InsightArticle } from './data';
import { SearchInput } from '@/components/ui/search-input';
import { InsightCard, InsightsTabs, type TabItem } from './components';
import { ComponentContainer } from '@/components/layout';
import { Loader } from '@/components/ui/loader';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useArticlesQuery } from '@/hooks/api/use-articles-query';
import { isLegacyTabSlug, resolveTabSlug } from '@/lib/api/articles/tab-slug';
import type { ArticlesListResponse } from '@/lib/api/articles/types';

const SEARCH_DEBOUNCE_MS = 300;

interface InsightsListProps {
  initialInsights: InsightArticle[];
  initialTab: string;
  initialSearchQuery: string;
  initialNewsUnavailable?: boolean;
  tabs: TabItem[];
}

export function InsightsList({ initialInsights, initialTab, initialSearchQuery, initialNewsUnavailable = false, tabs }: InsightsListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sectionRef = useRef<HTMLElement>(null);
  const skipSearchUrlCommitRef = useRef(false);

  const rawTabId = searchParams.get('tab') || initialTab;
  const activeTabId = resolveTabSlug(rawTabId);
  const searchQuery = searchParams.get('q') ?? initialSearchQuery;

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const debouncedSearchQuery = useDebouncedValue(localSearchQuery, SEARCH_DEBOUNCE_MS);

  const category = activeTabId === 'all' ? undefined : tabs.find((tab) => tab.id === activeTabId)?.label;
  const initialCategory = initialTab === 'all' ? undefined : tabs.find((tab) => tab.id === initialTab)?.label;

  const initialData = useMemo<ArticlesListResponse>(
    () => ({
      articles: initialInsights,
      ...(initialNewsUnavailable ? { newsUnavailable: true } : {})
    }),
    [initialInsights, initialNewsUnavailable]
  );

  const initialParams = useMemo(
    () => ({
      category: initialCategory,
      searchQuery: initialSearchQuery
    }),
    [initialCategory, initialSearchQuery]
  );

  const articlesQuery = useArticlesQuery({
    category,
    searchQuery,
    initialData,
    initialParams
  });

  const insights = articlesQuery.data?.articles ?? initialInsights;
  const isLoading = articlesQuery.isFetching;
  const hasQueryError = articlesQuery.isError;
  const isNewsUnavailable = articlesQuery.data !== undefined ? articlesQuery.data.newsUnavailable === true : initialNewsUnavailable;

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
    updateParams({ tab: tabId === 'all' ? null : tabId });
    scrollToTop();
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLocalSearchQuery(e.target.value);
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
              {isNewsUnavailable && (
                <div className='mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-900 md:mb-6'>
                  Could not load Tech & Dev news right now. Please try again later.
                </div>
              )}

              <div
                className={`grid grid-cols-1 gap-2.5 transition-opacity duration-300 md:grid-cols-2 xl:grid-cols-3 ${
                  isLoading ? 'pointer-events-none opacity-50' : 'opacity-100'
                }`}
              >
                {insights.map((article) => (
                  <InsightCard key={article.id} article={article} />
                ))}
                {insights.length === 0 && !isLoading && (
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
      </ComponentContainer>
    </section>
  );
}
