import { NextResponse } from 'next/server';

import { getArticles } from '@/lib/api/articles';
import { ARTICLES_PAGE_SIZE_DESKTOP } from '@/lib/api/articles/types';

export const runtime = 'nodejs';

/**
 * Public Insights list (merged DB + Soft Bee News archive).
 * Does not start news generation.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') ?? undefined;
    const searchQuery = searchParams.get('q') ?? undefined;
    const page = parsePositiveInt(searchParams.get('page'), 1);
    const pageSize = parsePositiveInt(searchParams.get('pageSize'), ARTICLES_PAGE_SIZE_DESKTOP);

    const result = await getArticles({
      category,
      searchQuery,
      page,
      pageSize
    });

    return NextResponse.json(result);
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
