import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';

import { isJsonObject, parseJsonValue, type JsonObject } from '@/lib/security/json';
import {
  NEWS_DEFAULT_LANGUAGE,
  NEWS_DEFAULT_REFRESH_COUNT,
  NewsApiError,
  getNewsRefreshSecret,
  isNewsConfigured,
  requestAndWaitForArticles,
  type NewsLanguage
} from '@/lib/news';

export const runtime = 'nodejs';
/** Generation can take several minutes. */
export const maxDuration = 300;

interface RefreshBody {
  count?: number;
  language?: NewsLanguage;
  idempotencyKey?: string;
}

/**
 * Ops / cron: request a new Soft Bee News batch and wait for a terminal status.
 * Authorize with `Authorization: Bearer <NEWS_REFRESH_SECRET|CRON_SECRET>`.
 * Page views must not call this — they read the archive via GET /api/insights.
 */
export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  if (!isNewsConfigured()) {
    return NextResponse.json({ error: 'News service is not configured.' }, { status: 503 });
  }

  try {
    const body = await readBody(request);
    const count = clampCount(body.count ?? NEWS_DEFAULT_REFRESH_COUNT);
    const language = body.language === 'uk' ? 'uk' : NEWS_DEFAULT_LANGUAGE;
    const idempotencyKey = normalizeIdempotencyKey(body.idempotencyKey) ?? `insights-refresh-${randomUUID()}`;

    const result = await requestAndWaitForArticles({ count, language, idempotencyKey });

    return NextResponse.json({
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    if (error instanceof NewsApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('POST /api/insights/refresh failed:', error);
    return NextResponse.json({ error: 'Failed to refresh Soft Bee News.' }, { status: 500 });
  }
}

function isAuthorized(request: Request): boolean {
  const secret = getNewsRefreshSecret();
  if (!secret) {
    return false;
  }

  const header = request.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) {
    return false;
  }

  return header.slice('Bearer '.length) === secret;
}

async function readBody(request: Request): Promise<RefreshBody> {
  try {
    const raw = await request.text();
    if (!raw.trim()) return {};
    const payload = parseJsonValue(raw);
    if (!isJsonObject(payload)) return {};
    return parseRefreshBody(payload);
  } catch {
    return {};
  }
}

function parseRefreshBody(payload: JsonObject): RefreshBody {
  const body: RefreshBody = {};

  const count = payload.count;
  if (typeof count === 'number' && Number.isFinite(count)) {
    body.count = count;
  }

  const language = payload.language;
  if (language === 'en' || language === 'uk') {
    body.language = language;
  }

  const idempotencyKey = payload.idempotencyKey;
  if (typeof idempotencyKey === 'string') {
    body.idempotencyKey = idempotencyKey;
  }

  return body;
}

function clampCount(value: number): number {
  if (!Number.isFinite(value)) return NEWS_DEFAULT_REFRESH_COUNT;
  return Math.min(20, Math.max(1, Math.trunc(value)));
}

function normalizeIdempotencyKey(value: string | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (trimmed.length < 8 || trimmed.length > 128) return null;
  if (!/^[A-Za-z0-9._:-]+$/.test(trimmed)) return null;
  return trimmed;
}
