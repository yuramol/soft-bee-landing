import { isJsonObject, readResponseJson, type JsonObject, type JsonValue } from '@/lib/security/json';

import type { InsightArticle } from '@/components/sections/insights/insights-list/data';
import { ARTICLES_PAGE_SIZE_DESKTOP, type ArticlesListResponse, type FetchArticlesParams } from './types';

/**
 * Client-side Insights list fetch via Next.js proxy (DB + Soft Bee News merge).
 * Keeps NEWS_API_KEY server-only.
 */
export async function fetchArticles(params: FetchArticlesParams = {}): Promise<ArticlesListResponse> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? ARTICLES_PAGE_SIZE_DESKTOP;

  const searchParams = new URLSearchParams();
  searchParams.set('page', String(page));
  searchParams.set('pageSize', String(pageSize));

  if (params.category && params.category !== 'All') {
    searchParams.set('category', params.category);
  }
  if (params.searchQuery?.trim()) {
    searchParams.set('q', params.searchQuery.trim());
  }

  const response = await fetch(`/api/insights?${searchParams.toString()}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch insights (${response.status})`);
  }

  const payload = await readResponseJson(response);
  const parsed = parseArticlesListResponse(payload);
  if (!parsed) {
    throw new Error('Insights API returned an unexpected payload.');
  }

  return parsed;
}

function parseArticlesListResponse(value: JsonValue): ArticlesListResponse | null {
  if (!isJsonObject(value)) return null;

  const articlesValue = value.articles;
  if (!Array.isArray(articlesValue)) return null;

  const articles: InsightArticle[] = [];
  for (const item of articlesValue) {
    const article = parseInsightArticle(item);
    if (article) articles.push(article);
  }

  const total = readNumber(value, 'total');
  const page = readNumber(value, 'page');
  const pageSize = readNumber(value, 'pageSize');
  const totalPages = readNumber(value, 'totalPages');

  if (total === undefined || page === undefined || pageSize === undefined || totalPages === undefined) {
    return null;
  }

  return { articles, total, page, pageSize, totalPages };
}

function parseInsightArticle(value: JsonValue): InsightArticle | null {
  if (!isJsonObject(value)) return null;

  const id = readString(value, 'id');
  const slug = readString(value, 'slug');
  const title = readString(value, 'title');
  const image = readString(value, 'image');
  const category = readString(value, 'category');
  const readTime = readString(value, 'readTime');
  const description = readString(value, 'description');
  const authorName = readString(value, 'authorName');
  const authorRole = readString(value, 'authorRole');
  const authorImage = readString(value, 'authorImage');
  const date = readString(value, 'date');

  if (!id || !slug || !title || !image || !category || !readTime || !description || !authorName || !authorRole || !authorImage || !date) {
    return null;
  }

  const sourceValue = readString(value, 'source');
  const source = sourceValue === 'ai' || sourceValue === 'db' ? sourceValue : undefined;

  return {
    id,
    slug,
    title,
    image,
    category,
    readTime,
    description,
    authorName,
    authorRole,
    authorImage,
    date,
    content: [],
    source
  };
}

function readString(payload: JsonObject, key: string): string | undefined {
  const value = payload[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function readNumber(payload: JsonObject, key: string): number | undefined {
  const value = payload[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}
