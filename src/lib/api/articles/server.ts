import { createServiceClient } from '@/utils/supabase/server';
import type { Database } from '@/types';

type ArticleRow = Database['public']['Tables']['articles']['Row'];
type TagRow = Database['public']['Tables']['tags']['Row'];

export interface ArticleWithTags extends ArticleRow {
  tags: TagRow[];
}

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
 * Fetch articles with optional filtering, search, and pagination.
 * Articles are ordered by prioritized (desc) then published_at (desc) to ensure
 * prioritized DB articles rank above future AI-sourced articles in merged feeds.
 */
export async function getArticles(params: GetArticlesParams = {}): Promise<GetArticlesResult> {
  const { category, searchQuery, page = 1, pageSize = 6 } = params;
  const supabase = createServiceClient();

  try {
    let query = supabase
      .from('articles')
      .select('*, article_tags(tag_id, tags(*))', { count: 'exact' })
      .order('prioritized', { ascending: false })
      .order('published_at', { ascending: false });

    // filter by category if provided
    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    // full-text search if query provided
    if (searchQuery && searchQuery.trim()) {
      const tsQuery = searchQuery
        .trim()
        .split(/\s+/)
        .map((term) => `${term}:*`)
        .join(' & ');
      query = query.textSearch('search_vector', tsQuery);
    }

    // pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Failed to fetch articles:', error.message);
      return { articles: [], total: 0, page, pageSize, totalPages: 0 };
    }

    // transform data to include tags array
    const articles: ArticleWithTags[] = (data || []).map((article) => {
      const articleTags = (article.article_tags || []) as Array<{
        tag_id: string;
        tags: TagRow | null;
      }>;

      return {
        ...article,
        tags: articleTags.map((at) => at.tags).filter((t): t is TagRow => t !== null)
      };
    });

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
  const supabase = createServiceClient();

  try {
    const { data, error } = await supabase.from('articles').select('*, article_tags(tag_id, tags(*))').eq('slug', slug).single();

    if (error || !data) {
      console.error('Failed to fetch article by slug:', error?.message ?? 'not found');
      return null;
    }

    const articleTags = (data.article_tags || []) as Array<{
      tag_id: string;
      tags: TagRow | null;
    }>;

    const article: ArticleWithTags = {
      ...data,
      tags: articleTags.map((at) => at.tags).filter((t): t is TagRow => t !== null)
    };

    return article;
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
  const supabase = createServiceClient();

  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*, article_tags(tag_id, tags(*))')
      .neq('slug', excludeSlug)
      .order('prioritized', { ascending: false })
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to fetch more articles:', error.message);
      return [];
    }

    const articles: ArticleWithTags[] = (data || []).map((article) => {
      const articleTags = (article.article_tags || []) as Array<{
        tag_id: string;
        tags: TagRow | null;
      }>;

      return {
        ...article,
        tags: articleTags.map((at) => at.tags).filter((t): t is TagRow => t !== null)
      };
    });

    return articles;
  } catch (error) {
    console.error('Failed to fetch more articles:', error);
    return [];
  }
}
