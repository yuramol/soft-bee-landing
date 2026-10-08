import type { ArticleBlockContent, InsightArticle } from '@/components/sections/insights/insights-list/data';
import { formatDateUtc } from '@/lib/date';

import {
  AI_INSIGHTS_CATEGORY,
  NEWS_DEFAULT_AUTHOR_IMAGE,
  NEWS_DEFAULT_AUTHOR_NAME,
  NEWS_DEFAULT_AUTHOR_ROLE,
  NEWS_FALLBACK_IMAGE
} from './constants';
import type { NewsArticle, NewsArticleCard, NewsSection, NewsSource } from './types';

/**
 * Map a Soft Bee News card to the Insights list/detail UI shape.
 * All AI news is shown under Tech & Dev.
 */
export function transformNewsCardToInsight(card: NewsArticleCard): InsightArticle {
  const cover = card.cover;
  const authorName = cover?.credit?.trim() || NEWS_DEFAULT_AUTHOR_NAME;

  return {
    id: card.id,
    image: cover?.url || NEWS_FALLBACK_IMAGE,
    category: AI_INSIGHTS_CATEGORY,
    readTime: formatReadTime(card.readTimeMinutes),
    title: card.title,
    description: card.excerpt,
    slug: card.slug,
    authorName,
    authorRole: NEWS_DEFAULT_AUTHOR_ROLE,
    authorImage: NEWS_DEFAULT_AUTHOR_IMAGE,
    date: formatDateUtc(card.publishedAt),
    content: [],
    source: 'ai'
  };
}

export function transformNewsCardsToInsights(cards: NewsArticleCard[]): InsightArticle[] {
  return cards.map(transformNewsCardToInsight);
}

/**
 * Full article: sections → InsightArticle content blocks, plus source attribution.
 */
export function transformNewsArticleToInsight(article: NewsArticle): InsightArticle {
  const base = transformNewsCardToInsight(article);
  const content = [
    ...mapSectionsToBlocks(article.sections),
    ...mapSourcesToBlocks(article.sources, article.cover?.credit, article.cover?.sourceUrl, article.cover?.licenseUrl)
  ];

  return {
    ...base,
    content
  };
}

function formatReadTime(minutes: number): string {
  const safe = Number.isFinite(minutes) && minutes > 0 ? Math.round(minutes) : 1;
  return `${safe} min read`;
}

function mapSectionsToBlocks(sections: NewsSection[]): ArticleBlockContent[] {
  const blocks: ArticleBlockContent[] = [];

  for (const section of sections) {
    let headingApplied = false;

    for (const [index, block] of section.blocks.entries()) {
      const id = `${section.id}-${block.type}-${index}`;

      if (block.type === 'paragraph') {
        blocks.push({
          id,
          type: 'text',
          heading: headingApplied ? undefined : section.title,
          shortHeading: headingApplied ? undefined : section.title,
          text: block.text
        });
        headingApplied = true;
        continue;
      }

      blocks.push({
        id,
        type: 'list',
        heading: headingApplied ? undefined : section.title,
        shortHeading: headingApplied ? undefined : section.title,
        items: block.items
      });
      headingApplied = true;
    }

    // Section with title but no blocks — still expose heading for TOC parity.
    if (!headingApplied && section.title) {
      blocks.push({
        id: section.id,
        type: 'text',
        heading: section.title,
        shortHeading: section.title,
        text: ''
      });
    }
  }

  return blocks;
}

function mapSourcesToBlocks(
  sources: NewsSource[],
  credit: string | null | undefined,
  sourceUrl: string | null | undefined,
  licenseUrl: string | null | undefined
): ArticleBlockContent[] {
  const lines: string[] = [];

  if (credit) {
    lines.push(`Image credit: ${credit}`);
  }
  if (sourceUrl) {
    lines.push(`Image source: ${sourceUrl}`);
  }
  if (licenseUrl) {
    lines.push(`License: ${licenseUrl}`);
  }

  for (const source of sources) {
    const published = source.publishedAt ? ` (${source.publishedAt})` : '';
    lines.push(`${source.name}${published}: ${source.url}`);
  }

  if (lines.length === 0) {
    return [];
  }

  return [
    {
      id: 'ai-sources',
      type: 'list',
      heading: 'Sources',
      shortHeading: 'Sources',
      items: lines
    }
  ];
}
