import type { NewsLanguage } from './types';

/** Insights category applied to every Soft Bee News article. */
export const AI_INSIGHTS_CATEGORY = 'Tech & Dev';

export const NEWS_DEFAULT_LANGUAGE: NewsLanguage = 'en';
export const NEWS_DEFAULT_REFRESH_COUNT = 5;
export const NEWS_ARCHIVE_LIST_LIMIT = 100;
/** Upper bound when loading DB rows for in-memory merge + pagination. */
export const NEWS_MERGE_DB_FETCH_LIMIT = 500;
/** In-process TTL for Soft Bee News archive reads (page views). */
export const NEWS_ARCHIVE_CACHE_TTL_MS = 30_000;

export const NEWS_REQUEST_TIMEOUT_MS = 30_000;
export const NEWS_POLL_INTERVAL_MS = 5_000;
/** Cap for website-triggered refresh polling (Vercel maxDuration budget). */
export const NEWS_POLL_MAX_MS = 240_000;

export const NEWS_DEFAULT_AUTHOR_NAME = 'Soft Bee News';
export const NEWS_DEFAULT_AUTHOR_ROLE = 'Tech & Dev';
export const NEWS_DEFAULT_AUTHOR_IMAGE = '/images/articles/article-author-img-1.webp';
export const NEWS_FALLBACK_IMAGE = '/images/services/services-img-1.webp';
