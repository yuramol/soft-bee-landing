import { getArticles, getTags } from '@/lib/api/articles';
import { transformArticlesToInsights } from '@/lib/api/articles/transform';
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
 * Server component wrapper that fetches articles from Supabase
 * and passes them to the client InsightsList component.
 */
export async function InsightsListServer({ searchParams }: InsightsListServerProps) {
  const params = await searchParams;
  const activeTabId = params.tab || 'all';
  const searchQuery = params.q || '';
  const currentPage = Number(params.page) || 1;

  const tags = await getTags();
  const activeTag = tags.find((tag) => tag.slug === activeTabId);
  const category = activeTag?.name;

  const result = await getArticles({
    category,
    searchQuery: searchQuery || undefined,
    page: currentPage,
    pageSize: 6
  });

  const insights = transformArticlesToInsights(result.articles);
  const tabs: TabItem[] = [ALL_TAB, ...tags.map((tag) => ({ id: tag.slug, label: tag.name }))];

  return (
    <InsightsList
      initialInsights={insights}
      initialTotal={result.total}
      initialPage={currentPage}
      initialTab={activeTabId}
      initialSearchQuery={searchQuery}
      tabs={tabs}
    />
  );
}
