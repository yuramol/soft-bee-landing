import { createServerClient } from '@/utils/supabase/server';
import { queryArticlesList } from './query';
import type { ArticleRow, FetchArticlesParams, TagRow } from './types';

export type GetArticlesParams = FetchArticlesParams;

export interface GetArticlesResult {
  articles: ArticleRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Fetch all article category tags ordered by creation (seed insert order).
 */
export async function getTags(): Promise<TagRow[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase.from('tags').select('*').order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message || 'Failed to fetch tags');
  }

  return data ?? [];
}

/**
 * Fetch articles with optional filtering, search, and pagination.
 * Articles are ordered by prioritized (desc) then published_at (desc) to ensure
 * prioritized DB articles rank above future AI-sourced articles in merged feeds.
 */
export async function getArticles(params: GetArticlesParams = {}): Promise<GetArticlesResult> {
  const supabase = await createServerClient();
  return queryArticlesList(supabase, params);
}

/**
 * Fetch a single article by slug.
 */
export async function getArticleBySlug(slug: string): Promise<ArticleRow | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).maybeSingle();

  if (error) {
    throw new Error(error.message || 'Failed to fetch article by slug');
  }

  return data;
}

/**
 * Fetch more articles for "More Insights" section, excluding the current article.
 * Returns up to `limit` articles ordered by prioritized then published_at.
 */
export async function getMoreArticles(excludeSlug: string, limit = 3): Promise<ArticleRow[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .neq('slug', excludeSlug)
    .order('prioritized', { ascending: false })
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message || 'Failed to fetch more articles');
  }

  return data ?? [];
}
