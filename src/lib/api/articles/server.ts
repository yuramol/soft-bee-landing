import { createServerClient } from '@/utils/supabase/server';
import { buildArticlesSearchOrFilter } from './search';
import { toArticleWithTags, type ArticleWithTags, type TagRow } from './types';

export type { ArticleWithTags } from './types';

export interface GetArticlesParams {
  category?: string;
  searchQuery?: string;
  page?: number;
  pageSize?: number;
}

export interface GetArticlesResult {
  articles: ArticleWithTags[];
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

  try {
    const { data, error } = await supabase.from('tags').select('*').order('created_at', { ascending: true });

    if (error) {
      console.error('Failed to fetch tags:', error.message);
      return [];
    }

    return data ?? [];
  } catch (error) {
    console.error('Failed to fetch tags:', error);
    return [];
  }
}

/**
 * Fetch articles with optional filtering, search, and pagination.
 * Articles are ordered by prioritized (desc) then published_at (desc) to ensure
 * prioritized DB articles rank above future AI-sourced articles in merged feeds.
 */
export async function getArticles(params: GetArticlesParams = {}): Promise<GetArticlesResult> {
  const { category, searchQuery, page = 1, pageSize = 6 } = params;
  const supabase = await createServerClient();

  try {
    let query = supabase
      .from('articles')
      .select('*', { count: 'exact' })
      .order('prioritized', { ascending: false })
      .order('published_at', { ascending: false });

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    const searchFilter = searchQuery ? buildArticlesSearchOrFilter(searchQuery) : null;
    if (searchFilter) {
      query = query.or(searchFilter);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Failed to fetch articles:', error.message);
      return { articles: [], total: 0, page, pageSize, totalPages: 0 };
    }

    const articles = (data || []).map((article) => toArticleWithTags(article));

    const total = count ?? 0;
    const totalPages = Math.ceil(total / pageSize);

    return { articles, total, page, pageSize, totalPages };
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    return { articles: [], total: 0, page, pageSize, totalPages: 0 };
  }
}

/**
 * Fetch a single article by slug with its tags.
 */
export async function getArticleBySlug(slug: string): Promise<ArticleWithTags | null> {
  const supabase = await createServerClient();

  try {
    const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).single();

    if (error || !data) {
      console.error('Failed to fetch article by slug:', error?.message ?? 'not found');
      return null;
    }

    return toArticleWithTags(data);
  } catch (error) {
    console.error('Failed to fetch article by slug:', error);
    return null;
  }
}

/**
 * Fetch more articles for "More Insights" section, excluding the current article.
 * Returns up to `limit` articles ordered by prioritized then published_at.
 */
export async function getMoreArticles(excludeSlug: string, limit = 3): Promise<ArticleWithTags[]> {
  const supabase = await createServerClient();

  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .neq('slug', excludeSlug)
      .order('prioritized', { ascending: false })
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to fetch more articles:', error.message);
      return [];
    }

    return (data || []).map((article) => toArticleWithTags(article));
  } catch (error) {
    console.error('Failed to fetch more articles:', error);
    return [];
  }
}
