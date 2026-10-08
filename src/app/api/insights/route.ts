import { NextResponse } from 'next/server';

import { getArticles } from '@/lib/api/articles';

export const runtime = 'nodejs';

/**
 * Public Insights list (merged DB + Soft Bee News archive).
 * Always returns the 3 latest items for the requested tab/category.
 * Search queries all DB and API items, then returns the 3 latest matches.
 * Soft Bee News is read-only here; archive fetches are cached ~1 day.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') ?? undefined;
    const searchQuery = searchParams.get('q') ?? undefined;

    const result = await getArticles({
      category,
      searchQuery
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
