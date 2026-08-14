export interface InsightArticle {
  id: string;
  image: string;
  category: string;
  readTime: string;
  title: string;
  description: string;
  slug: string;
}

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

export const mockInsights: InsightArticle[] = Array.from({ length: 90 }).map((_, i) => {
  const base = baseArticles[i % baseArticles.length];
  return {
    id: String(i + 1),
    image: images[i % images.length],
    category: base.category,
    readTime: base.readTime,
    title: i >= 6 ? `${base.title} - Volume ${Math.floor(i / 6) + 1}` : base.title,
    description: base.description,
    slug: `article-${i + 1}`
  };
});
