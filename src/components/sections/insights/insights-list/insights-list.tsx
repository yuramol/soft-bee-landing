'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { mockInsights } from './data';
import { SearchInput } from '@/components/ui/search-input';
import { CustomPagination } from '@/components/ui/custom-pagination';
import { InsightCard, InsightsTabs } from './components';
import { ComponentContainer } from '@/components/layout';
import { Loader } from '@/components/ui/loader';
import { useWidth } from '@/hooks/use-width';
import insightsContent from './content.json';

const TABS = insightsContent.tabs;

export function InsightsList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sectionRef = useRef<HTMLElement>(null);
  const { isMd } = useWidth();

  const activeTabId = searchParams.get('tab') || 'all';
  const searchQuery = searchParams.get('q') || '';
  const currentPage = Number(searchParams.get('page')) || 1;

  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = isMd ? 6 : 3;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

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

  const filteredInsights = mockInsights.filter((insight) => {
    const activeTabObj = TABS.find((t) => t.id === activeTabId);
    const matchesTab = activeTabId === 'all' || insight.category === activeTabObj?.label;
    const matchesSearch =
      insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insight.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalPages = Math.ceil(filteredInsights.length / itemsPerPage);
  const paginatedInsights = filteredInsights.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleTabClick = (tabId: string) => {
    updateParams({ tab: tabId === 'all' ? null : tabId, page: '1' });
    scrollToTop();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    updateParams({ q: q ? q : null, page: '1' });
  };

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
            value={searchQuery}
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
