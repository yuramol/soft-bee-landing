import { getArticles, getTags, resolveTabSlug } from '@/lib/api/articles';
import { InsightsList } from './insights-list';
import type { TabItem } from './components';

const ALL_TAB: TabItem = { id: 'all', label: 'All' };

interface InsightsListServerProps {
  searchParams: Promise<{
    tab?: string;
    q?: string;
  }>;
}

/**
 * Server component wrapper that fetches merged Insights (DB + Soft Bee News)
 * and passes them to the client InsightsList component.
 * Always returns the 3 latest items per tab.
 */
export async function InsightsListServer({ searchParams }: InsightsListServerProps) {
  const params = await searchParams;
  const activeTabId = resolveTabSlug(params.tab || 'all');
  const searchQuery = params.q || '';

  const tags = await getTags();
  const activeTag = activeTabId === 'all' ? undefined : tags.find((tag) => tag.slug === activeTabId);
  const category = activeTag?.name;

  const result = await getArticles({
    category,
    searchQuery: searchQuery || undefined
  });

  const tabs: TabItem[] = [ALL_TAB, ...tags.map((tag) => ({ id: tag.slug, label: tag.name }))];

  return (
    <InsightsList
      initialInsights={result.articles}
      initialTab={activeTabId}
      initialSearchQuery={searchQuery}
      initialNewsUnavailable={result.newsUnavailable === true}
      tabs={tabs}
    />
  );
}
