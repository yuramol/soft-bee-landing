import type { NewsLanguage } from './types';

/** Insights category applied to every Soft Bee News article. */
export const AI_INSIGHTS_CATEGORY = 'Tech & Dev';

export const NEWS_DEFAULT_LANGUAGE: NewsLanguage = 'en';
/** Soft Bee News `/v1/articles` rejects `limit` above 20 (400 Invalid request). */
export const NEWS_ARCHIVE_LIST_LIMIT = 20;
/** Upper bound when loading DB rows for in-memory merge + pagination. */
export const NEWS_MERGE_DB_FETCH_LIMIT = 500;
/** How long Soft Bee News archive responses may be reused before re-fetching. */
export const NEWS_ARCHIVE_REVALIDATE_SECONDS = 60 * 60 * 24;
export const NEWS_ARCHIVE_CACHE_TTL_MS = NEWS_ARCHIVE_REVALIDATE_SECONDS * 1000;

export const NEWS_REQUEST_TIMEOUT_MS = 30_000;

export const NEWS_DEFAULT_AUTHOR_NAME = 'Soft Bee News';
export const NEWS_DEFAULT_AUTHOR_ROLE = 'Tech & Dev';
export const NEWS_DEFAULT_AUTHOR_IMAGE = '/images/articles/article-author-img-1.webp';
export const NEWS_FALLBACK_IMAGE = '/images/services/services-img-1.webp';
