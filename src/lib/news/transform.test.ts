import { describe, expect, it } from 'vitest';

import { AI_INSIGHTS_CATEGORY } from './constants';
import { transformNewsArticleToInsight, transformNewsCardToInsight } from './transform';
import type { NewsArticle, NewsArticleCard } from './types';

const card: NewsArticleCard = {
  id: 'news-1',
  slug: 'ai-slug',
  title: 'AI Title',
  excerpt: 'Short excerpt',
  topic: 'Whatever',
  language: 'en',
  readTimeMinutes: 4,
  publishedAt: '2026-09-20T12:00:00.000Z',
  sourcePublishedAt: null,
  updatedAt: null,
  cover: {
    url: 'https://cdn.example.com/cover.jpg',
    alt: 'Cover',
    width: 800,
    height: 600,
    credit: 'Photo Desk',
    sourceUrl: 'https://example.com/photo',
    license: 'CC',
    licenseUrl: 'https://example.com/license'
  }
};

describe('transformNewsCardToInsight', () => {
  it('forces Tech & Dev category and marks source as ai', () => {
    const insight = transformNewsCardToInsight(card);
    expect(insight.category).toBe(AI_INSIGHTS_CATEGORY);
    expect(insight.source).toBe('ai');
    expect(insight.readTime).toBe('4 min read');
    expect(insight.image).toBe('https://cdn.example.com/cover.jpg');
    expect(insight.authorName).toBe('Photo Desk');
  });
});

describe('transformNewsArticleToInsight', () => {
  it('maps sections and sources into content blocks', () => {
    const full: NewsArticle = {
      ...card,
      sections: [
        {
          id: 'sec-1',
          title: 'Section One',
          blocks: [
            { type: 'paragraph', text: 'Hello' },
            { type: 'list', items: ['a', 'b'] }
          ]
        }
      ],
      tableOfContents: [{ id: 'sec-1', title: 'Section One' }],
      related: [],
      sources: [{ name: 'Reuters', url: 'https://reuters.example', publishedAt: null }]
    };

    const insight = transformNewsArticleToInsight(full);
    expect(insight.content[0]?.type).toBe('text');
    expect(insight.content[0]?.heading).toBe('Section One');
    expect(insight.content.some((block) => block.type === 'list' && block.heading === 'Sources')).toBe(true);
  });
});
