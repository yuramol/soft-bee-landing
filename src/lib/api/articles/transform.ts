import type { ArticleWithTags } from './server';
import type { InsightArticle, ArticleBlockContent } from '@/components/sections/insights/insights-list/data';

/**
 * Transform ArticleWithTags from database to InsightArticle for UI components.
 */
export function transformArticleToInsight(article: ArticleWithTags): InsightArticle {
  // parse content as ArticleBlockContent[]
  const content = Array.isArray(article.content) ? (article.content as ArticleBlockContent[]) : [];

  // format date as DD.MM.YYYY
  const dateObj = new Date(article.published_at);
  const formattedDate = dateObj
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
    .replace(/\//g, '.');

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
    date: formattedDate,
    content
  };
}

/**
 * Transform multiple articles to insights.
 */
export function transformArticlesToInsights(articles: ArticleWithTags[]): InsightArticle[] {
  return articles.map(transformArticleToInsight);
}
