import type { InsightArticle } from '@/components/sections/insights/insights-list/data';
import { formatDateUtc } from '@/lib/date';
import { parseArticleContent } from './content';
import type { ArticleWithTags } from './types';

/**
 * Transform ArticleWithTags from database to InsightArticle for UI components.
 */
export function transformArticleToInsight(article: ArticleWithTags): InsightArticle {
  return {
    id: article.id,
    image: article.image,
    category: article.category,
    readTime: article.read_time,
    title: article.title,
    description: article.description,
    slug: article.slug,
    authorName: article.author_name,
    authorRole: article.author_role,
    authorImage: article.author_image,
    date: formatDateUtc(article.published_at),
    content: parseArticleContent(article.content)
  };
}

/**
 * Transform multiple articles to insights.
 */
export function transformArticlesToInsights(articles: ArticleWithTags[]): InsightArticle[] {
  return articles.map(transformArticleToInsight);
}
