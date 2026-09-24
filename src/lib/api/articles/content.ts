import { z } from 'zod';

import type { ArticleBlockContent } from '@/components/sections/insights/insights-list/data';
import type { Json } from '@/types';

const articleBlockContentSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'quote', 'image', 'list', 'conclusion']),
  heading: z.string().optional(),
  shortHeading: z.string().optional(),
  text: z.string().optional(),
  authorName: z.string().optional(),
  authorRole: z.string().optional(),
  image: z.string().optional(),
  caption: z.string().optional(),
  description: z.string().optional(),
  items: z.array(z.string()).optional()
});

const articleContentSchema = z.array(articleBlockContentSchema);

/**
 * Parse jsonb article content into typed blocks. Invalid payloads become [].
 */
export function parseArticleContent(value: Json): ArticleBlockContent[] {
  const parsed = articleContentSchema.safeParse(value);
  return parsed.success ? parsed.data : [];
}
