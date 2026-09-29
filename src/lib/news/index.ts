export type { ListArticlesParams, NewsArticle, NewsArticleCard, NewsCover, NewsLanguage } from './types';

export {
  AI_INSIGHTS_CATEGORY,
  NEWS_ARCHIVE_CACHE_TTL_MS,
  NEWS_ARCHIVE_LIST_LIMIT,
  NEWS_ARCHIVE_REVALIDATE_SECONDS,
  NEWS_DEFAULT_LANGUAGE,
  NEWS_MERGE_DB_FETCH_LIMIT
} from './constants';

export { getNewsApiKey, getNewsServiceUrl, isNewsConfigured } from './secrets';

export { NewsApiError, getNewsArticle, listNewsArticles, parseRetryAfterMs } from './client';

export { transformNewsArticleToInsight, transformNewsCardToInsight, transformNewsCardsToInsights } from './transform';
