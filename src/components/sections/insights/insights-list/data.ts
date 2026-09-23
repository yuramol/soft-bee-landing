export interface ArticleBlockContent {
  id: string;
  type: 'text' | 'quote' | 'image' | 'list' | 'conclusion';
  heading?: string;
  shortHeading?: string;
  text?: string;
  authorName?: string;
  authorRole?: string;
  image?: string;
  caption?: string;
  description?: string;
  items?: string[];
}

export interface InsightArticle {
  id: string;
  image: string;
  category: string;
  readTime: string;
  title: string;
  description: string;
  slug: string;
  authorName: string;
  authorRole: string;
  authorImage: string;
  date: string;
  content: ArticleBlockContent[];
}
