import { getArticles } from '@/lib/api/articles';
import { transformArticlesToInsights } from '@/lib/api/articles/transform';
import { InsightsList } from './insights-list';

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

  // map tab id to category
  const categoryMap: Record<string, string> = {
    all: 'All',
    tech: 'Tech & Dev',
    team: 'Team & Workflow',
    company: 'Company news'
  };

  const category = categoryMap[activeTabId] || 'All';

  // fetch articles from Supabase
  const result = await getArticles({
    category: category === 'All' ? undefined : category,
    searchQuery: searchQuery || undefined,
    page: currentPage,
    pageSize: 6
  });

  // transform to UI format
  const insights = transformArticlesToInsights(result.articles);

  return (
    <InsightsList
      initialInsights={insights}
      initialTotal={result.total}
      initialPage={currentPage}
      initialTab={activeTabId}
      initialSearchQuery={searchQuery}
    />
  );
}
