import { notFound } from 'next/navigation';
import { ArticleHero, ArticlePreview, ArticleContent, MoreInsights } from '@/components/sections/article';
import { mockInsights } from '@/components/sections/insights/insights-list/data';

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const article = mockInsights.find((a) => a.slug === slug);
  if (!article) return notFound();

  const moreArticles = mockInsights.filter((a) => a.slug !== slug).slice(0, 3);

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
