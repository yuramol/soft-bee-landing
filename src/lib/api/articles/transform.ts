import type { InsightArticle } from '@/components/sections/insights/insights-list/data';
import { formatDateUtc } from '@/lib/date';
import { parseArticleContent } from './content';
import type { ArticleRow } from './types';

/**
 * Transform an articles row from the database to InsightArticle for UI components.
 */
export function transformArticleToInsight(article: ArticleRow): InsightArticle {
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
export function transformArticlesToInsights(articles: ArticleRow[]): InsightArticle[] {
  return articles.map(transformArticleToInsight);
}
