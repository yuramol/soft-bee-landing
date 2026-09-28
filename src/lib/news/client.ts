import { isJsonObject, readResponseJson, type JsonObject, type JsonValue } from '@/lib/security/json';

import {
  NEWS_ARCHIVE_LIST_LIMIT,
  NEWS_DEFAULT_LANGUAGE,
  NEWS_POLL_INTERVAL_MS,
  NEWS_POLL_MAX_MS,
  NEWS_REQUEST_TIMEOUT_MS
} from './constants';
import { getNewsApiKey, getNewsServiceUrl, isNewsConfigured } from './secrets';
import type {
  CreateArticleRequestInput,
  ListArticlesParams,
  NewsArticle,
  NewsArticleCard,
  NewsCover,
  NewsLanguage,
  NewsPeriod,
  NewsRequestMeta,
  NewsRequestResponse,
  NewsRequestStatus,
  NewsSection,
  NewsSectionBlock,
  NewsSource
} from './types';

export class NewsApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'NewsApiError';
    this.status = status;
  }
}

/**
 * Unauthenticated readiness probe.
 */
export async function checkNewsReady(): Promise<boolean> {
  const baseUrl = getNewsServiceUrl();
  if (!baseUrl) return false;

  try {
    const response = await fetchWithTimeout(`${baseUrl}/ready`, {
      method: 'GET',
      timeoutMs: NEWS_REQUEST_TIMEOUT_MS
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Archive of ready articles — does not start generation. Use for site page views.
 */
export async function listNewsArticles(params: ListArticlesParams = {}): Promise<NewsArticleCard[]> {
  const { baseUrl, apiKey } = getNewsConfig();
  const language = params.language ?? NEWS_DEFAULT_LANGUAGE;
  const limit = clampInt(params.limit ?? NEWS_ARCHIVE_LIST_LIMIT, 1, 100);

  const url = new URL(`${baseUrl}/v1/articles`);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('language', language);

  const response = await fetchWithTimeout(url.toString(), {
    method: 'GET',
    headers: newsHeaders(apiKey),
    timeoutMs: NEWS_REQUEST_TIMEOUT_MS
  });

  if (!response.ok) {
    throw new NewsApiError(await readErrorMessage(response), response.status);
  }

  const payload = await readJsonObject(response);
  return parseArticleCards(payload.data);
}

export async function getNewsArticle(slug: string, language: NewsLanguage = NEWS_DEFAULT_LANGUAGE): Promise<NewsArticle> {
  const { baseUrl, apiKey } = getNewsConfig();
  const url = new URL(`${baseUrl}/v1/articles/${encodeURIComponent(slug)}`);
  url.searchParams.set('language', language);

  const response = await fetchWithTimeout(url.toString(), {
    method: 'GET',
    headers: newsHeaders(apiKey),
    timeoutMs: NEWS_REQUEST_TIMEOUT_MS
  });

  if (!response.ok) {
    throw new NewsApiError(await readErrorMessage(response), response.status);
  }

  const payload = await readJsonObject(response);
  const article = parseFullArticle(payload.data);
  if (!article) {
    throw new NewsApiError('News article response missing data.', 502);
  }

  return article;
}

/**
 * Start a new generation batch (or resume via idempotency key).
 */
export async function createArticleRequest(input: CreateArticleRequestInput): Promise<NewsRequestResponse> {
  const { baseUrl, apiKey } = getNewsConfig();
  const language = input.language ?? NEWS_DEFAULT_LANGUAGE;
  const count = clampInt(input.count, 1, 20);

  const response = await fetchWithTimeout(`${baseUrl}/v1/article-requests`, {
    method: 'POST',
    headers: {
      ...newsHeaders(apiKey),
      'Content-Type': 'application/json',
      'Idempotency-Key': input.idempotencyKey
    },
    body: JSON.stringify({ count, language }),
    timeoutMs: NEWS_REQUEST_TIMEOUT_MS
  });

  if (!response.ok && response.status !== 202) {
    throw new NewsApiError(await readErrorMessage(response), response.status);
  }

  return parseRequestResponse(await readJsonObject(response));
}

export async function getArticleRequest(requestId: string): Promise<NewsRequestResponse> {
  const { baseUrl, apiKey } = getNewsConfig();

  const response = await fetchWithTimeout(`${baseUrl}/v1/article-requests/${encodeURIComponent(requestId)}`, {
    method: 'GET',
    headers: newsHeaders(apiKey),
    timeoutMs: NEWS_REQUEST_TIMEOUT_MS
  });

  if (!response.ok) {
    throw new NewsApiError(await readErrorMessage(response), response.status);
  }

  return parseRequestResponse(await readJsonObject(response));
}

export interface WaitForArticleRequestOptions {
  pollIntervalMs?: number;
  maxWaitMs?: number;
}

/**
 * Poll until completed / partial / failed. Respects Retry-After when present.
 */
export async function waitForArticleRequest(requestId: string, options: WaitForArticleRequestOptions = {}): Promise<NewsRequestResponse> {
  const pollIntervalMs = options.pollIntervalMs ?? NEWS_POLL_INTERVAL_MS;
  const maxWaitMs = options.maxWaitMs ?? NEWS_POLL_MAX_MS;
  const startedAt = Date.now();

  let latest = await getArticleRequest(requestId);

  while (isPendingStatus(latest.meta.status)) {
    if (Date.now() - startedAt >= maxWaitMs) {
      throw new NewsApiError(`News request ${requestId} timed out while ${latest.meta.status}.`, 504);
    }

    await sleep(pollIntervalMs);
    latest = await getArticleRequest(requestId);
  }

  return latest;
}

/**
 * Create (or resume) a batch and wait for a terminal status.
 */
export async function requestAndWaitForArticles(
  input: CreateArticleRequestInput,
  options?: WaitForArticleRequestOptions
): Promise<NewsRequestResponse> {
  const created = await createArticleRequest(input);
  if (!isPendingStatus(created.meta.status)) {
    return created;
  }

  return waitForArticleRequest(created.meta.requestId, options);
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

async function fetchWithTimeout(url: string, init: RequestInit & { timeoutMs: number }): Promise<Response> {
  const { timeoutMs, ...requestInit } = init;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...requestInit,
      signal: controller.signal,
      cache: 'no-store'
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

function parseRequestResponse(payload: JsonObject): NewsRequestResponse {
  const meta = parseRequestMeta(payload.meta);
  if (!meta) {
    throw new NewsApiError('News request response missing meta.', 502);
  }

  return {
    data: parseArticleCards(payload.data),
    meta
  };
}

function parseRequestMeta(value: JsonValue | undefined): NewsRequestMeta | null {
  if (value === undefined || !isJsonObject(value)) return null;

  const requestId = readString(value, ['requestId', 'id']);
  const status = readString(value, ['status']);
  if (!requestId || !status) return null;

  return {
    requestId,
    status: status as NewsRequestStatus,
    requestedCount: readNumber(value, ['requestedCount']) ?? 0,
    returnedCount: readNumber(value, ['returnedCount']) ?? 0,
    complete: value.complete === true,
    language: readString(value, ['language']) ?? NEWS_DEFAULT_LANGUAGE,
    period: parsePeriod(value.period),
    reason: readString(value, ['reason']) ?? null,
    createdAt: readString(value, ['createdAt']) ?? new Date().toISOString(),
    finishedAt: readString(value, ['finishedAt']) ?? null,
    statusUrl: readString(value, ['statusUrl']) ?? `/v1/article-requests/${requestId}`
  };
}

function parsePeriod(value: JsonValue | undefined): NewsPeriod | null {
  if (value === undefined || !isJsonObject(value)) return null;
  const from = readString(value, ['from']);
  const to = readString(value, ['to']);
  if (!from || !to) return null;
  return { from, to };
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

function isPendingStatus(status: NewsRequestStatus): boolean {
  return status === 'queued' || status === 'running';
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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
