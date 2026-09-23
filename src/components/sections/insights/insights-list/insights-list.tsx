'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { InsightArticle } from './data';
import { SearchInput } from '@/components/ui/search-input';
import { CustomPagination } from '@/components/ui/custom-pagination';
import { InsightCard, InsightsTabs } from './components';
import { ComponentContainer } from '@/components/layout';
import { Loader } from '@/components/ui/loader';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useWidth } from '@/hooks/use-width';
import insightsContent from './content.json';

const TABS = insightsContent.tabs;
const SEARCH_DEBOUNCE_MS = 300;

interface InsightsListProps {
  initialInsights: InsightArticle[];
  initialTotal: number;
  initialPage: number;
  initialTab: string;
  initialSearchQuery: string;
}

export function InsightsList({ initialInsights, initialTotal, initialPage, initialTab, initialSearchQuery }: InsightsListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sectionRef = useRef<HTMLElement>(null);
  const { isMd } = useWidth();

  const activeTabId = searchParams.get('tab') || initialTab;
  const searchQuery = searchParams.get('q') || initialSearchQuery;
  const currentPage = Number(searchParams.get('page')) || initialPage;

  const [isLoading, setIsLoading] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const debouncedSearchQuery = useDebouncedValue(localSearchQuery, SEARCH_DEBOUNCE_MS);

  const itemsPerPage = isMd ? 6 : 3;

  // keep input in sync when URL search changes (e.g. browser back/forward)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // commit debounced search to the URL so each keystroke does not hit the server
  useEffect(() => {
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

  // trigger page transition for smooth loading state
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchParams]);

  const updateParams = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const scrollToTop = () => {
    if (sectionRef.current) {
      const offsetTop = sectionRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: offsetTop - 100, behavior: 'smooth' });
    }
  };

  // use server-fetched data
  const paginatedInsights = initialInsights;
  const totalPages = Math.ceil(initialTotal / itemsPerPage);

  const handleTabClick = (tabId: string) => {
    updateParams({ tab: tabId === 'all' ? null : tabId, page: '1' });
    scrollToTop();
  };

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLocalSearchQuery(e.target.value);
  }

  const handlePageChange = (page: number) => {
    updateParams({ page: page.toString() });
    scrollToTop();
  };

  return (
    <section ref={sectionRef} className='z-20 bg-transparent px-4 pt-2.5 md:pt-8.75 lg:px-10.5'>
      <ComponentContainer>
        <div className='mb-2.5 flex flex-col items-start justify-between gap-6 md:mb-8.75 md:flex-row'>
          <InsightsTabs tabs={TABS} activeTabId={activeTabId} onTabChange={handleTabClick} />

          <SearchInput
            placeholder='Search'
            wrapperClassName='hidden md:w-83.75 lg:block'
            value={localSearchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className='relative mb-5 md:mb-10'>
          <div
            className={`grid grid-cols-1 gap-2.5 transition-opacity duration-300 md:grid-cols-2 xl:grid-cols-3 ${
              isLoading ? 'pointer-events-none opacity-50' : 'opacity-100'
            }`}
          >
            {paginatedInsights.map((article) => (
              <InsightCard key={article.id} article={article} />
            ))}
            {paginatedInsights.length === 0 && (
              <div className='col-span-full py-12 text-center text-gray-500'>No articles found matching your criteria.</div>
            )}
          </div>

          {isLoading && (
            <div className='absolute inset-0 z-10 flex items-start justify-center pt-[25%]'>
              <Loader className='text-brand-black h-12 w-12' />
            </div>
          )}
        </div>

        <div className={`transition-opacity duration-300 ${isLoading ? 'pointer-events-none invisible opacity-0' : 'visible opacity-100'}`}>
          <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </ComponentContainer>
    </section>
  );
}
