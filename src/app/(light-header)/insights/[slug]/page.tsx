import { notFound } from 'next/navigation';
import { ArticleHero, ArticlePreview, ArticleContent, MoreInsights } from '@/components/sections/article';
import { getInsightBySlug, getMoreArticles } from '@/lib/api/articles';

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const article = await getInsightBySlug(slug);
  if (!article) return notFound();

  const moreArticles = await getMoreArticles(slug, 3);

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
      <ArticlePreview image={article.image} title={article.title} unoptimized={article.source === 'ai'} />
      <ArticleContent content={article.content} />
      <MoreInsights articles={moreArticles} />
    </>
  );
}
