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

const mockContent: ArticleBlockContent[] = [
  {
    id: 'hidden-cost',
    type: 'text',
    heading: 'The hidden cost of rigid systems',
    shortHeading: 'The hidden cost',
    text: 'Many companies build their digital products with a fixed mindset, focusing only on current needs. While this might work in the short term, it creates massive technical debt later on. When new requirements emerge, a rigid architecture becomes brittle, making every single update expensive and time-consuming.\n\n· Scalability bottlenecks: Hardcoded features limit your ability to handle more users.\n· Slow time-to-market: Deploying new updates feels like moving a mountain.\n· Team frustration: Developers spend more time fixing legacy bugs than innovating.'
  },
  {
    id: 'quote-1',
    type: 'quote',
    text: 'Creating a resilient system does not mean working without rules. On the contrary, it requires a smart, modular framework. Think of it as a well-organized ecosystem where every component has a clear purpose but can adapt or be replaced without breaking the entire structure.',
    authorName: 'Quote author'
  },
  {
    id: 'balance',
    type: 'text',
    heading: 'Finding the balance between structure and flexibility',
    shortHeading: 'Balance',
    text: 'Creating a resilient system does not mean working without rules. On the contrary, it requires a smart, modular framework. Think of it as a well-organized ecosystem where every component has a clear purpose but can adapt or be replaced without breaking the entire structure.'
  },
  {
    id: 'image-1',
    type: 'image',
    image: '/images/services/services-img-3.webp',
    caption: 'A person sitting at a white desk in a sunlit room, speaking into a smartphone and taking notes in front of an open laptop'
  },
  {
    id: 'conclusion',
    type: 'conclusion',
    heading: 'Final thoughts',
    shortHeading: 'Conclusion',
    text: 'Building flexible software is not just a technical choice — it is a business strategy. By choosing adaptability over rigidity, you ensure that your product can grow, evolve, and stay relevant for years to come.'
  }
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

export const mockInsights: InsightArticle[] = Array.from({ length: 90 }).map((_, i) => {
  const base = baseArticles[i % baseArticles.length];
  const author = authors[i % authors.length];
  const dateObj = new Date(2024, 0, 1 + i); // incrementing days for mock dates

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
    date: dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.'),
    content: (() => {
      const blocks = mockContent.map((block) => (block.type === 'quote' ? { ...block, authorName: author.name } : block));
      const conclusion = blocks.find((b) => b.type === 'conclusion');
      const otherBlocks = blocks.filter((b) => b.type !== 'conclusion');

      const shift = i % otherBlocks.length;
      const rearranged = [...otherBlocks.slice(shift), ...otherBlocks.slice(0, shift)];

      return conclusion ? [...rearranged, conclusion] : rearranged;
    })()
  };
});
