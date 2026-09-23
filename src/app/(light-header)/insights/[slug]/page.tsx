import { notFound } from 'next/navigation';
import { ArticleHero, ArticlePreview, ArticleContent, MoreInsights } from '@/components/sections/article';
import { getArticleBySlug, getMoreArticles } from '@/lib/api/articles';
import { transformArticleToInsight, transformArticlesToInsights } from '@/lib/api/articles/transform';

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const articleData = await getArticleBySlug(slug);
  if (!articleData) return notFound();

  const article = transformArticleToInsight(articleData);

  const moreArticlesData = await getMoreArticles(slug, 3);
  const moreArticles = transformArticlesToInsights(moreArticlesData);

  return (
    <>
      <ArticleHero
        topic={article.category}
        title={article.title}
        authorName={article.authorName}
        authorRole={article.authorRole}
        authorImage={article.authorImage}
        readTime={article.readTime}
        date={article.date}
      />
      <ArticlePreview image={article.image} title={article.title} />
      <ArticleContent content={article.content} />
      <MoreInsights articles={moreArticles} />
    </>
  );
}
