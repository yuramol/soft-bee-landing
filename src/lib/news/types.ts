export type NewsLanguage = 'en' | 'uk';

export interface NewsCover {
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  credit: string | null;
  sourceUrl: string | null;
  license: string | null;
  licenseUrl: string | null;
}

export interface NewsArticleCard {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  topic: string | null;
  language: NewsLanguage | string;
  readTimeMinutes: number;
  publishedAt: string;
  sourcePublishedAt: string | null;
  updatedAt: string | null;
  cover: NewsCover | null;
}

export interface NewsParagraphBlock {
  type: 'paragraph';
  text: string;
}

export interface NewsListBlock {
  type: 'list';
  items: string[];
}

export type NewsSectionBlock = NewsParagraphBlock | NewsListBlock;

export interface NewsSection {
  id: string;
  title: string;
  blocks: NewsSectionBlock[];
}

export interface NewsSource {
  name: string;
  url: string;
  publishedAt: string | null;
}

export interface NewsArticle extends NewsArticleCard {
  sections: NewsSection[];
  tableOfContents: { id: string; title: string }[];
  related: NewsArticleCard[];
  sources: NewsSource[];
}

export interface ListArticlesParams {
  limit?: number;
  language?: NewsLanguage;
}
