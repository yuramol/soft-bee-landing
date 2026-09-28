export type {
  CreateArticleRequestInput,
  ListArticlesParams,
  NewsArticle,
  NewsArticleCard,
  NewsCover,
  NewsLanguage,
  NewsPeriod,
  NewsRequestMeta,
  NewsRequestResponse,
  NewsRequestStatus
} from './types';

export {
  AI_INSIGHTS_CATEGORY,
  NEWS_ARCHIVE_CACHE_TTL_MS,
  NEWS_ARCHIVE_LIST_LIMIT,
  NEWS_DEFAULT_LANGUAGE,
  NEWS_DEFAULT_REFRESH_COUNT,
  NEWS_MERGE_DB_FETCH_LIMIT,
  NEWS_POLL_INTERVAL_MS,
  NEWS_POLL_MAX_MS
} from './constants';

export { getNewsApiKey, getNewsRefreshSecret, getNewsServiceUrl, isNewsConfigured } from './secrets';

export {
  NewsApiError,
  checkNewsReady,
  createArticleRequest,
  getArticleRequest,
  getNewsArticle,
  invalidateNewsArchiveCache,
  listNewsArticles,
  parseRetryAfterMs,
  requestAndWaitForArticles,
  waitForArticleRequest
} from './client';

export { transformNewsArticleToInsight, transformNewsCardToInsight, transformNewsCardsToInsights } from './transform';
