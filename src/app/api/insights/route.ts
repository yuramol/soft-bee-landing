import { NextResponse } from 'next/server';

import { getArticles } from '@/lib/api/articles';
import { clampArticlesPageSize } from '@/lib/api/articles/merge';
import { ARTICLES_PAGE_SIZE_DESKTOP, ARTICLES_PAGE_SIZE_MAX } from '@/lib/api/articles/types';

export const runtime = 'nodejs';

/**
 * Public Insights list (merged DB + Soft Bee News archive).
 * Soft Bee News is read-only here; archive fetches are cached ~1 day.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') ?? undefined;
    const searchQuery = searchParams.get('q') ?? undefined;
    const page = parsePositiveInt(searchParams.get('page'), 1);
    const pageSize = clampArticlesPageSize(
      parsePositiveInt(searchParams.get('pageSize'), ARTICLES_PAGE_SIZE_DESKTOP),
      ARTICLES_PAGE_SIZE_DESKTOP,
      ARTICLES_PAGE_SIZE_MAX
    );

    const result = await getArticles({
      category,
      searchQuery,
      page,
      pageSize
    });

    return NextResponse.json(result, {
      headers: {
        // Short browser/CDN cache for merged feed; news archive itself revalidates ~1 day.
        'Cache-Control': 'private, max-age=60, stale-while-revalidate=300'
      }
    });
  } catch (error) {
    console.error('GET /api/insights failed:', error);
    return NextResponse.json({ error: 'Failed to load insights.' }, { status: 500 });
  }
}

function parsePositiveInt(value: string | null, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
