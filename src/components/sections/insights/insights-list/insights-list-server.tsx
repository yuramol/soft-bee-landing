import { getArticles, getTags, resolveTabSlug } from '@/lib/api/articles';
import { ARTICLES_PAGE_SIZE_DESKTOP } from '@/lib/api/articles/types';
import { InsightsList } from './insights-list';
import type { TabItem } from './components';

const ALL_TAB: TabItem = { id: 'all', label: 'All' };

interface InsightsListServerProps {
  searchParams: Promise<{
    tab?: string;
    q?: string;
    page?: string;
  }>;
}

/**
 * Server component wrapper that fetches merged Insights (DB + Soft Bee News)
 * and passes them to the client InsightsList component.
 */
export async function InsightsListServer({ searchParams }: InsightsListServerProps) {
  const params = await searchParams;
  const activeTabId = resolveTabSlug(params.tab || 'all');
  const searchQuery = params.q || '';
  const currentPage = Number.parseInt(params.page ?? '', 10);
  const page = Number.isFinite(currentPage) && currentPage > 0 ? currentPage : 1;
  const pageSize = ARTICLES_PAGE_SIZE_DESKTOP;

  const tags = await getTags();
  const activeTag = activeTabId === 'all' ? undefined : tags.find((tag) => tag.slug === activeTabId);
  const category = activeTag?.name;

  const result = await getArticles({
    category,
    searchQuery: searchQuery || undefined,
    page,
    pageSize
  });

  const tabs: TabItem[] = [ALL_TAB, ...tags.map((tag) => ({ id: tag.slug, label: tag.name }))];

  return (
    <InsightsList
      initialInsights={result.articles}
      initialTotal={result.total}
      initialPage={page}
      initialPageSize={pageSize}
      initialTab={activeTabId}
      initialSearchQuery={searchQuery}
      initialNewsUnavailable={result.newsUnavailable === true}
      tabs={tabs}
    />
  );
}
