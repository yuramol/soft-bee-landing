import { isJsonObject, readResponseJson, type JsonObject, type JsonValue } from '@/lib/security/json';

import {
  NEWS_ARCHIVE_CACHE_TTL_MS,
  NEWS_ARCHIVE_LIST_LIMIT,
  NEWS_ARCHIVE_REVALIDATE_SECONDS,
  NEWS_DEFAULT_LANGUAGE,
  NEWS_REQUEST_TIMEOUT_MS
} from './constants';
import { getNewsApiKey, getNewsServiceUrl, isNewsConfigured } from './secrets';
import type {
  ListArticlesParams,
  NewsArticle,
  NewsArticleCard,
  NewsCover,
  NewsLanguage,
  NewsSection,
  NewsSectionBlock,
  NewsSource
} from './types';

export class NewsApiError extends Error {
  readonly status: number;
  readonly retryAfterMs: number | null;

  constructor(message: string, status: number, retryAfterMs: number | null = null) {
    super(message);
    this.name = 'NewsApiError';
    this.status = status;
    this.retryAfterMs = retryAfterMs;
  }
}

interface NewsArchiveCacheEntry {
  language: string;
  cards: NewsArticleCard[];
  expiresAt: number;
}

let newsArchiveCache: NewsArchiveCacheEntry | null = null;

/**
 * Archive of ready articles. Soft Bee News generates on its own schedule;
 * this landing only reads and merges. Cached ~1 day to avoid extra API hits.
 */
export async function listNewsArticles(params: ListArticlesParams = {}): Promise<NewsArticleCard[]> {
  const language = params.language ?? NEWS_DEFAULT_LANGUAGE;
  const limit = clampInt(params.limit ?? NEWS_ARCHIVE_LIST_LIMIT, 1, NEWS_ARCHIVE_LIST_LIMIT);

  const cached = newsArchiveCache;
  if (cached && cached.language === language && cached.expiresAt > Date.now()) {
    return cached.cards.slice(0, limit);
  }

  const { baseUrl, apiKey } = getNewsConfig();
  const url = new URL(`${baseUrl}/v1/articles`);
  url.searchParams.set('limit', String(NEWS_ARCHIVE_LIST_LIMIT));
  url.searchParams.set('language', language);

  const response = await fetchWithTimeout(url.toString(), {
    method: 'GET',
    headers: newsHeaders(apiKey),
    timeoutMs: NEWS_REQUEST_TIMEOUT_MS,
    revalidateSeconds: NEWS_ARCHIVE_REVALIDATE_SECONDS
  });

  if (!response.ok) {
    throw new NewsApiError(await readErrorMessage(response), response.status, parseRetryAfterMs(response));
  }

  const payload = await readJsonObject(response);
  const cards = parseArticleCards(payload.data);
  newsArchiveCache = {
    language,
    cards,
    expiresAt: Date.now() + NEWS_ARCHIVE_CACHE_TTL_MS
  };

  return cards.slice(0, limit);
}

export async function getNewsArticle(slug: string, language: NewsLanguage = NEWS_DEFAULT_LANGUAGE): Promise<NewsArticle> {
  const { baseUrl, apiKey } = getNewsConfig();
  const url = new URL(`${baseUrl}/v1/articles/${encodeURIComponent(slug)}`);
  url.searchParams.set('language', language);

  const response = await fetchWithTimeout(url.toString(), {
    method: 'GET',
    headers: newsHeaders(apiKey),
    timeoutMs: NEWS_REQUEST_TIMEOUT_MS,
    revalidateSeconds: NEWS_ARCHIVE_REVALIDATE_SECONDS
  });

  if (!response.ok) {
    throw new NewsApiError(await readErrorMessage(response), response.status, parseRetryAfterMs(response));
  }

  const payload = await readJsonObject(response);
  const article = parseFullArticle(payload.data);
  if (!article) {
    throw new NewsApiError('News article response missing data.', 502);
  }

  return article;
}

export { isNewsConfigured };

function getNewsConfig(): { baseUrl: string; apiKey: string } {
  const baseUrl = getNewsServiceUrl();
  const apiKey = getNewsApiKey();

  if (!baseUrl || !apiKey) {
    throw new NewsApiError('News service is not configured.', 503);
  }

  return { baseUrl, apiKey };
}

function newsHeaders(apiKey: string): HeadersInit {
  return {
    Accept: 'application/json',
    'X-API-Key': apiKey
  };
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit & { timeoutMs: number; revalidateSeconds?: number }
): Promise<Response> {
  const { timeoutMs, revalidateSeconds, ...requestInit } = init;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...requestInit,
      signal: controller.signal,
      ...(revalidateSeconds !== undefined
        ? { next: { revalidate: revalidateSeconds } }
        : { cache: 'no-store' as RequestCache })
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new NewsApiError('News request timed out.', 504);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Parse Retry-After as seconds or HTTP-date. Returns milliseconds, or null.
 */
export function parseRetryAfterMs(response: Response): number | null {
  const header = response.headers.get('retry-after');
  if (!header) return null;

  const asSeconds = Number.parseInt(header, 10);
  if (Number.isFinite(asSeconds) && asSeconds >= 0) {
    return asSeconds * 1000;
  }

  const asDateMs = Date.parse(header);
  if (!Number.isFinite(asDateMs)) return null;

  const delta = asDateMs - Date.now();
  return delta > 0 ? delta : 0;
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const payload = await readJsonObject(response);
    const message = readString(payload, ['error', 'message', 'detail', 'reason']);
    if (message) return message;

    const meta = payload.meta;
    if (isJsonObject(meta)) {
      const reason = readString(meta, ['reason']);
      if (reason) return reason;
    }
  } catch {
    // ignore non-JSON bodies
  }

  return `News request failed (${response.status}).`;
}

async function readJsonObject(response: Response): Promise<JsonObject> {
  const payload = await readResponseJson(response);
  if (!isJsonObject(payload)) {
    throw new NewsApiError('News service returned a non-object JSON body.', 502);
  }
  return payload;
}

function parseArticleCards(value: JsonValue | undefined): NewsArticleCard[] {
  if (!Array.isArray(value)) return [];

  const cards: NewsArticleCard[] = [];
  for (const item of value) {
    const card = parseArticleCard(item);
    if (card) cards.push(card);
  }
  return cards;
}

function parseArticleCard(value: JsonValue | undefined): NewsArticleCard | null {
  if (value === undefined || !isJsonObject(value)) return null;

  const id = readString(value, ['id']);
  const slug = readString(value, ['slug']);
  const title = readString(value, ['title']);
  if (!id || !slug || !title) return null;

  return {
    id,
    slug,
    title,
    excerpt: readString(value, ['excerpt']) ?? '',
    topic: readString(value, ['topic']) ?? null,
    language: readString(value, ['language']) ?? NEWS_DEFAULT_LANGUAGE,
    readTimeMinutes: readNumber(value, ['readTimeMinutes']) ?? 1,
    publishedAt: readString(value, ['publishedAt']) ?? new Date().toISOString(),
    sourcePublishedAt: readString(value, ['sourcePublishedAt']) ?? null,
    updatedAt: readString(value, ['updatedAt']) ?? null,
    cover: parseCover(value.cover)
  };
}

function parseFullArticle(value: JsonValue | undefined): NewsArticle | null {
  const card = parseArticleCard(value);
  if (!card || value === undefined || !isJsonObject(value)) return null;

  return {
    ...card,
    sections: parseSections(value.sections),
    tableOfContents: parseToc(value.tableOfContents),
    related: parseArticleCards(value.related),
    sources: parseSources(value.sources)
  };
}

function parseCover(value: JsonValue | undefined): NewsCover | null {
  if (value === undefined || !isJsonObject(value)) return null;
  const url = readString(value, ['url']);
  if (!url) return null;

  return {
    url,
    alt: readString(value, ['alt']) ?? null,
    width: readNumber(value, ['width']) ?? null,
    height: readNumber(value, ['height']) ?? null,
    credit: readString(value, ['credit']) ?? null,
    sourceUrl: readString(value, ['sourceUrl']) ?? null,
    license: readString(value, ['license']) ?? null,
    licenseUrl: readString(value, ['licenseUrl']) ?? null
  };
}

function parseSections(value: JsonValue | undefined): NewsSection[] {
  if (!Array.isArray(value)) return [];

  const sections: NewsSection[] = [];
  for (const item of value) {
    if (!isJsonObject(item)) continue;
    const id = readString(item, ['id']);
    const title = readString(item, ['title']);
    if (!id || !title) continue;
    sections.push({
      id,
      title,
      blocks: parseSectionBlocks(item.blocks)
    });
  }
  return sections;
}

function parseSectionBlocks(value: JsonValue | undefined): NewsSectionBlock[] {
  if (!Array.isArray(value)) return [];

  const blocks: NewsSectionBlock[] = [];
  for (const item of value) {
    if (!isJsonObject(item)) continue;
    const type = readString(item, ['type']);
    if (type === 'paragraph') {
      const text = readString(item, ['text']);
      if (text) blocks.push({ type: 'paragraph', text });
      continue;
    }
    if (type === 'list') {
      const itemsValue = item.items;
      if (!Array.isArray(itemsValue)) continue;
      const items = itemsValue.filter((entry): entry is string => typeof entry === 'string' && entry.length > 0);
      if (items.length > 0) blocks.push({ type: 'list', items });
    }
  }
  return blocks;
}

function parseToc(value: JsonValue | undefined): { id: string; title: string }[] {
  if (!Array.isArray(value)) return [];

  const toc: { id: string; title: string }[] = [];
  for (const item of value) {
    if (!isJsonObject(item)) continue;
    const id = readString(item, ['id']);
    const title = readString(item, ['title']);
    if (id && title) toc.push({ id, title });
  }
  return toc;
}

function parseSources(value: JsonValue | undefined): NewsSource[] {
  if (!Array.isArray(value)) return [];

  const sources: NewsSource[] = [];
  for (const item of value) {
    if (!isJsonObject(item)) continue;
    const name = readString(item, ['name']);
    const url = readString(item, ['url']);
    if (!name || !url) continue;
    sources.push({
      name,
      url,
      publishedAt: readString(item, ['publishedAt']) ?? null
    });
  }
  return sources;
}

function readString(payload: JsonObject, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
  }
  return undefined;
}

function readNumber(payload: JsonObject, keys: string[]): number | undefined {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
  }
  return undefined;
}

function clampInt(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.trunc(value)));
}
