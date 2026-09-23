#!/usr/bin/env node
/**
 * Generate Supabase seed SQL from the exact mock data in data.ts
 * This ensures seeded articles match the mocks exactly.
 */

const randomHeadings = [
  'The hidden cost of rigid systems',
  'Finding the balance between structure and flexibility',
  'Why modern teams need adaptable workflows',
  'The evolution of digital product design',
  'Scaling your architecture without the pain',
  'Empathy in software engineering'
];

const randomShortHeadings = ['The hidden cost', 'Balance', 'Workflows', 'Evolution', 'Scaling', 'Empathy'];

const randomTexts = [
  'Many companies build their digital products with a fixed mindset, focusing only on current needs. While this might work in the short term, it creates massive technical debt later on. When new requirements emerge, a rigid architecture becomes brittle, making every single update expensive and time-consuming.\\n\\n· Scalability bottlenecks: Hardcoded features limit your ability to handle more users.\\n· Slow time-to-market: Deploying new updates feels like moving a mountain.\\n· Team frustration: Developers spend more time fixing legacy bugs than innovating.',
  'Creating a resilient system does not mean working without rules. On the contrary, it requires a smart, modular framework. Think of it as a well-organized ecosystem where every component has a clear purpose but can adapt or be replaced without breaking the entire structure.',
  "When we talk about future-proofing, we often think of technology choices. However, the most crucial element is the team's ability to adapt. Providing developers with the right tools and a supportive culture is the foundation of any successful long-term project.",
  "Automation is no longer a luxury—it's a necessity. From testing to deployment, automating repetitive tasks frees up human creativity to solve complex, high-value problems.",
  'By investing in cross-functional collaboration, companies can reduce silos and foster an environment where ideas flow freely. The best products are built when designers, developers, and product managers share a unified vision from day one.'
];

const randomQuotes = [
  'Creating a resilient system does not mean working without rules. On the contrary, it requires a smart, modular framework. Think of it as a well-organized ecosystem where every component has a clear purpose but can adapt or be replaced without breaking the entire structure.',
  'The best code is no code at all. Every line you write is a liability. Keep it simple, modular, and easy to delete.',
  'Design is not just what it looks like and feels like. Design is how it works. Our goal is to bridge the gap between aesthetics and functionality.',
  'Innovation distinguishes between a leader and a follower. To stay ahead, we must continuously challenge our own assumptions and embrace change.'
];

const baseArticles = [
  {
    category: 'Tech & Dev',
    readTime: '5 min read',
    title: 'Building Without Friction: Why "Soft" Technology is the Future of Innovation',
    description: 'Discover how flexible software architecture and empathetic design are shaping the next generation of digital products.'
  },
  {
    category: 'Team & Workflow',
    readTime: '8 min read',
    title: 'The Honeycomb Structure: Organizing Team Workflows for Maximum Efficiency',
    description: "How to apply the geometric precision of bees to your team's daily tasks, remote communication, and project management."
  },
  {
    category: 'Company news',
    readTime: '4 min read',
    title: 'Behind the Buzz: How We Built Our Latest Feature with User Comfort in Mind',
    description: "A deep dive into our development process. We're sharing the challenges, the wins, and the code behind our newest update."
  },
  {
    category: 'Tech & Dev',
    readTime: '6 min read',
    title: 'Exploring the Future of Frontend Frameworks',
    description: 'A look into how modern frameworks are optimizing performance and developer experience.'
  },
  {
    category: 'Company news',
    readTime: '3 min read',
    title: 'Soft Bee Expands to New Office',
    description: 'We are thrilled to announce our new hub for innovation and collaboration.'
  },
  {
    category: 'Team & Workflow',
    readTime: '7 min read',
    title: 'Mastering Remote Collaboration',
    description: 'Essential tools and practices for keeping distributed teams aligned and productive.'
  }
];

const images = [
  '/images/services/services-img-1.webp',
  '/images/services/services-img-2.webp',
  '/images/services/services-img-3.webp',
  '/images/services/services-img-4.webp'
];

const authors = [
  { name: 'Anna Kovalenko', role: 'Lead Developer', image: '/images/articles/article-author-img-1.webp' },
  { name: 'Dmytro Petrenko', role: 'Product Manager', image: '/images/articles/article-author-img-1.webp' },
  { name: 'Olena Shevchenko', role: 'UI/UX Designer', image: '/images/articles/article-author-img-1.webp' }
];

// Articles to mark as prioritized (well distributed across the 90)
const prioritizedArticleIds = [1, 3, 10, 25, 40, 55, 70, 85];

function escapeSQL(str) {
  return str.replace(/'/g, "''");
}

function generateContent(i) {
  const blocks = [];
  const numBlocks = 2 + (i % 3); // 2 to 4 blocks before conclusion
  const author = authors[i % authors.length];

  for (let j = 0; j < numBlocks; j++) {
    const id = `block-${i}-${j}`;
    const typeStr = j === 0 ? 'text' : ['text', 'image', 'quote'][(i * 3 + j * 5) % 3];

    if (typeStr === 'text') {
      blocks.push({
        id,
        type: 'text',
        heading: randomHeadings[(i * 7 + j * 11) % randomHeadings.length],
        shortHeading: randomShortHeadings[(i * 7 + j * 11) % randomShortHeadings.length],
        text: randomTexts[(i * 13 + j * 17) % randomTexts.length]
      });
    } else if (typeStr === 'image') {
      blocks.push({
        id,
        type: 'image',
        image: images[(i * 5 + j * 7) % images.length],
        caption: 'An illustrative view of modern workspace and technology.'
      });
    } else if (typeStr === 'quote') {
      blocks.push({
        id,
        type: 'quote',
        text: randomQuotes[(i * 19 + j * 23) % randomQuotes.length],
        authorName: author.name
      });
    }
  }

  // Add conclusion at the end
  blocks.push({
    id: `block-${i}-conclusion`,
    type: 'conclusion',
    heading: 'Final thoughts',
    shortHeading: 'Conclusion',
    text: 'Building flexible software is not just a technical choice — it is a business strategy. By choosing adaptability over rigidity, you ensure that your product can grow, evolve, and stay relevant for years to come.'
  });

  return blocks;
}

function generateMockArticles() {
  return Array.from({ length: 90 }).map((_, i) => {
    const base = baseArticles[i % baseArticles.length];
    const author = authors[i % authors.length];
    const dateObj = new Date(2024, 0, 1 + i);

    return {
      id: String(i + 1),
      image: images[i % images.length],
      category: base.category,
      readTime: base.readTime,
      title: i >= 6 ? `${base.title} - Volume ${Math.floor(i / 6) + 1}` : base.title,
      description: base.description,
      slug: `article-${i + 1}`,
      authorName: author.name,
      authorRole: author.role,
      authorImage: author.image,
      date: dateObj,
      content: generateContent(i),
      prioritized: prioritizedArticleIds.includes(i + 1)
    };
  });
}

function generateSeedSQL() {
  const articles = generateMockArticles();

  let sql = `-- seed: insights articles from mockInsights (data.ts)
-- generated from the exact mock data structure with all 90 articles
-- prioritized: article-${prioritizedArticleIds.join(', article-')} (${prioritizedArticleIds.length} total)

-- insert category-based tags (derived from article categories)
insert into public.tags (name, slug) values
  ('Tech & Dev', 'tech-dev'),
  ('Team & Workflow', 'team-workflow'),
  ('Company news', 'company-news')
on conflict (slug) do nothing;

-- insert articles (all 90 from mocks)
insert into public.articles (
  slug,
  title,
  description,
  image,
  category,
  read_time,
  author_name,
  author_role,
  author_image,
  published_at,
  prioritized,
  content
) values\n`;

  const values = articles.map((article, idx) => {
    const contentJSON = JSON.stringify(article.content);
    const escapedContent = escapeSQL(contentJSON);
    const publishedAt = article.date.toISOString();

    return `  (
    '${article.slug}',
    '${escapeSQL(article.title)}',
    '${escapeSQL(article.description)}',
    '${article.image}',
    '${article.category}',
    '${article.readTime}',
    '${escapeSQL(article.authorName)}',
    '${escapeSQL(article.authorRole)}',
    '${article.authorImage}',
    '${publishedAt}',
    ${article.prioritized},
    '${escapedContent}'::jsonb
  )`;
  });

  sql += values.join(',\n');
  sql += '\non conflict (slug) do nothing;\n\n';

  // Link articles to category tags
  sql += `-- link articles to their category tags
with article_slugs as (
  select id, slug, category from public.articles
),
tag_slugs as (
  select id, slug, name from public.tags
)
insert into public.article_tags (article_id, tag_id)
select a.id, t.id 
from article_slugs a
join tag_slugs t on (
  (a.category = 'Tech & Dev' and t.slug = 'tech-dev') or
  (a.category = 'Team & Workflow' and t.slug = 'team-workflow') or
  (a.category = 'Company news' and t.slug = 'company-news')
)
on conflict do nothing;
`;

  return sql;
}

console.log(generateSeedSQL());
