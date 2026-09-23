-- seed: insights articles with tags for local/dev testing
-- populates articles covering all three categories with multiple tags and prioritized examples

-- insert tags
insert into public.tags (name, slug) values
  ('Architecture', 'architecture'),
  ('Performance', 'performance'),
  ('Best Practices', 'best-practices'),
  ('Team Culture', 'team-culture'),
  ('Remote Work', 'remote-work'),
  ('Product Updates', 'product-updates'),
  ('Company Culture', 'company-culture'),
  ('Frontend', 'frontend'),
  ('Backend', 'backend'),
  ('DevOps', 'devops'),
  ('Design', 'design'),
  ('Innovation', 'innovation')
on conflict (slug) do nothing;

-- insert articles
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
) values
  (
    'article-1',
    'Building Without Friction: Why "Soft" Technology is the Future of Innovation',
    'Discover how flexible software architecture and empathetic design are shaping the next generation of digital products.',
    '/images/services/services-img-1.webp',
    'Tech & Dev',
    '5 min read',
    'Anna Kovalenko',
    'Lead Developer',
    '/images/articles/article-author-img-1.webp',
    '2024-01-01 10:00:00+00',
    true,
    '[
      {
        "id": "block-1-0",
        "type": "text",
        "heading": "The hidden cost of rigid systems",
        "shortHeading": "The hidden cost",
        "text": "Many companies build their digital products with a fixed mindset, focusing only on current needs. While this might work in the short term, it creates massive technical debt later on. When new requirements emerge, a rigid architecture becomes brittle, making every single update expensive and time-consuming.\n\n· Scalability bottlenecks: Hardcoded features limit your ability to handle more users.\n· Slow time-to-market: Deploying new updates feels like moving a mountain.\n· Team frustration: Developers spend more time fixing legacy bugs than innovating."
      },
      {
        "id": "block-1-1",
        "type": "quote",
        "text": "Creating a resilient system does not mean working without rules. On the contrary, it requires a smart, modular framework. Think of it as a well-organized ecosystem where every component has a clear purpose but can adapt or be replaced without breaking the entire structure.",
        "authorName": "Anna Kovalenko"
      },
      {
        "id": "block-1-2",
        "type": "image",
        "image": "/images/services/services-img-2.webp",
        "caption": "An illustrative view of modern workspace and technology."
      },
      {
        "id": "block-1-conclusion",
        "type": "conclusion",
        "heading": "Final thoughts",
        "shortHeading": "Conclusion",
        "text": "Building flexible software is not just a technical choice — it is a business strategy. By choosing adaptability over rigidity, you ensure that your product can grow, evolve, and stay relevant for years to come."
      }
    ]'::jsonb
  ),
  (
    'article-2',
    'The Honeycomb Structure: Organizing Team Workflows for Maximum Efficiency',
    'How to apply the geometric precision of bees to your team''s daily tasks, remote communication, and project management.',
    '/images/services/services-img-2.webp',
    'Team & Workflow',
    '8 min read',
    'Dmytro Petrenko',
    'Product Manager',
    '/images/articles/article-author-img-1.webp',
    '2024-01-08 10:00:00+00',
    true,
    '[
      {
        "id": "block-2-0",
        "type": "text",
        "heading": "Finding the balance between structure and flexibility",
        "shortHeading": "Balance",
        "text": "Creating a resilient system does not mean working without rules. On the contrary, it requires a smart, modular framework. Think of it as a well-organized ecosystem where every component has a clear purpose but can adapt or be replaced without breaking the entire structure."
      },
      {
        "id": "block-2-1",
        "type": "text",
        "heading": "Why modern teams need adaptable workflows",
        "shortHeading": "Workflows",
        "text": "When we talk about future-proofing, we often think of technology choices. However, the most crucial element is the team''s ability to adapt. Providing developers with the right tools and a supportive culture is the foundation of any successful long-term project."
      },
      {
        "id": "block-2-conclusion",
        "type": "conclusion",
        "heading": "Final thoughts",
        "shortHeading": "Conclusion",
        "text": "By investing in cross-functional collaboration, companies can reduce silos and foster an environment where ideas flow freely. The best products are built when designers, developers, and product managers share a unified vision from day one."
      }
    ]'::jsonb
  ),
  (
    'article-3',
    'Behind the Buzz: How We Built Our Latest Feature with User Comfort in Mind',
    'A deep dive into our development process. We''re sharing the challenges, the wins, and the code behind our newest update.',
    '/images/services/services-img-3.webp',
    'Company news',
    '4 min read',
    'Olena Shevchenko',
    'UI/UX Designer',
    '/images/articles/article-author-img-1.webp',
    '2024-01-15 10:00:00+00',
    true,
    '[
      {
        "id": "block-3-0",
        "type": "text",
        "heading": "The evolution of digital product design",
        "shortHeading": "Evolution",
        "text": "Automation is no longer a luxury—it''s a necessity. From testing to deployment, automating repetitive tasks frees up human creativity to solve complex, high-value problems."
      },
      {
        "id": "block-3-1",
        "type": "quote",
        "text": "Design is not just what it looks like and feels like. Design is how it works. Our goal is to bridge the gap between aesthetics and functionality.",
        "authorName": "Olena Shevchenko"
      },
      {
        "id": "block-3-conclusion",
        "type": "conclusion",
        "heading": "Final thoughts",
        "shortHeading": "Conclusion",
        "text": "Building flexible software is not just a technical choice — it is a business strategy. By choosing adaptability over rigidity, you ensure that your product can grow, evolve, and stay relevant for years to come."
      }
    ]'::jsonb
  ),
  (
    'exploring-future-frontend-frameworks',
    'Exploring the Future of Frontend Frameworks',
    'A look into how modern frameworks are optimizing performance and developer experience.',
    '/images/services/services-img-4.webp',
    'Tech & Dev',
    '6 min read',
    'Anna Kovalenko',
    'Lead Developer',
    '/images/articles/article-author-img-1.webp',
    '2024-01-22 10:00:00+00',
    false,
    '[
      {
        "id": "block-4-0",
        "type": "text",
        "heading": "Scaling your architecture without the pain",
        "shortHeading": "Scaling",
        "text": "By investing in cross-functional collaboration, companies can reduce silos and foster an environment where ideas flow freely. The best products are built when designers, developers, and product managers share a unified vision from day one."
      },
      {
        "id": "block-4-1",
        "type": "image",
        "image": "/images/services/services-img-1.webp",
        "caption": "An illustrative view of modern workspace and technology."
      },
      {
        "id": "block-4-conclusion",
        "type": "conclusion",
        "heading": "Final thoughts",
        "shortHeading": "Conclusion",
        "text": "Building flexible software is not just a technical choice — it is a business strategy. By choosing adaptability over rigidity, you ensure that your product can grow, evolve, and stay relevant for years to come."
      }
    ]'::jsonb
  ),
  (
    'soft-bee-expands-new-office',
    'Soft Bee Expands to New Office',
    'We are thrilled to announce our new hub for innovation and collaboration.',
    '/images/services/services-img-1.webp',
    'Company news',
    '3 min read',
    'Dmytro Petrenko',
    'Product Manager',
    '/images/articles/article-author-img-1.webp',
    '2024-01-29 10:00:00+00',
    false,
    '[
      {
        "id": "block-5-0",
        "type": "text",
        "heading": "Empathy in software engineering",
        "shortHeading": "Empathy",
        "text": "When we talk about future-proofing, we often think of technology choices. However, the most crucial element is the team''s ability to adapt. Providing developers with the right tools and a supportive culture is the foundation of any successful long-term project."
      },
      {
        "id": "block-5-conclusion",
        "type": "conclusion",
        "heading": "Final thoughts",
        "shortHeading": "Conclusion",
        "text": "By investing in cross-functional collaboration, companies can reduce silos and foster an environment where ideas flow freely. The best products are built when designers, developers, and product managers share a unified vision from day one."
      }
    ]'::jsonb
  ),
  (
    'mastering-remote-collaboration',
    'Mastering Remote Collaboration',
    'Essential tools and practices for keeping distributed teams aligned and productive.',
    '/images/services/services-img-2.webp',
    'Team & Workflow',
    '7 min read',
    'Olena Shevchenko',
    'UI/UX Designer',
    '/images/articles/article-author-img-1.webp',
    '2024-02-05 10:00:00+00',
    false,
    '[
      {
        "id": "block-6-0",
        "type": "text",
        "heading": "The hidden cost of rigid systems",
        "shortHeading": "The hidden cost",
        "text": "Many companies build their digital products with a fixed mindset, focusing only on current needs. While this might work in the short term, it creates massive technical debt later on. When new requirements emerge, a rigid architecture becomes brittle, making every single update expensive and time-consuming.\n\n· Scalability bottlenecks: Hardcoded features limit your ability to handle more users.\n· Slow time-to-market: Deploying new updates feels like moving a mountain.\n· Team frustration: Developers spend more time fixing legacy bugs than innovating."
      },
      {
        "id": "block-6-1",
        "type": "quote",
        "text": "Innovation distinguishes between a leader and a follower. To stay ahead, we must continuously challenge our own assumptions and embrace change.",
        "authorName": "Olena Shevchenko"
      },
      {
        "id": "block-6-conclusion",
        "type": "conclusion",
        "heading": "Final thoughts",
        "shortHeading": "Conclusion",
        "text": "Building flexible software is not just a technical choice — it is a business strategy. By choosing adaptability over rigidity, you ensure that your product can grow, evolve, and stay relevant for years to come."
      }
    ]'::jsonb
  ),
  (
    'microservices-vs-monoliths-2024',
    'Microservices vs Monoliths: Making the Right Choice in 2024',
    'An honest comparison of architectural patterns with real-world use cases and trade-offs.',
    '/images/services/services-img-3.webp',
    'Tech & Dev',
    '9 min read',
    'Anna Kovalenko',
    'Lead Developer',
    '/images/articles/article-author-img-1.webp',
    '2024-02-12 10:00:00+00',
    true,
    '[
      {
        "id": "block-7-0",
        "type": "text",
        "heading": "Finding the balance between structure and flexibility",
        "shortHeading": "Balance",
        "text": "Creating a resilient system does not mean working without rules. On the contrary, it requires a smart, modular framework. Think of it as a well-organized ecosystem where every component has a clear purpose but can adapt or be replaced without breaking the entire structure."
      },
      {
        "id": "block-7-1",
        "type": "image",
        "image": "/images/services/services-img-4.webp",
        "caption": "An illustrative view of modern workspace and technology."
      },
      {
        "id": "block-7-2",
        "type": "text",
        "heading": "Why modern teams need adaptable workflows",
        "shortHeading": "Workflows",
        "text": "When we talk about future-proofing, we often think of technology choices. However, the most crucial element is the team''s ability to adapt. Providing developers with the right tools and a supportive culture is the foundation of any successful long-term project."
      },
      {
        "id": "block-7-conclusion",
        "type": "conclusion",
        "heading": "Final thoughts",
        "shortHeading": "Conclusion",
        "text": "Building flexible software is not just a technical choice — it is a business strategy. By choosing adaptability over rigidity, you ensure that your product can grow, evolve, and stay relevant for years to come."
      }
    ]'::jsonb
  ),
  (
    'our-journey-to-carbon-neutrality',
    'Our Journey to Carbon Neutrality',
    'How we reduced our carbon footprint and what we learned along the way.',
    '/images/services/services-img-1.webp',
    'Company news',
    '5 min read',
    'Dmytro Petrenko',
    'Product Manager',
    '/images/articles/article-author-img-1.webp',
    '2024-02-19 10:00:00+00',
    false,
    '[
      {
        "id": "block-8-0",
        "type": "text",
        "heading": "The evolution of digital product design",
        "shortHeading": "Evolution",
        "text": "Automation is no longer a luxury—it''s a necessity. From testing to deployment, automating repetitive tasks frees up human creativity to solve complex, high-value problems."
      },
      {
        "id": "block-8-conclusion",
        "type": "conclusion",
        "heading": "Final thoughts",
        "shortHeading": "Conclusion",
        "text": "By investing in cross-functional collaboration, companies can reduce silos and foster an environment where ideas flow freely. The best products are built when designers, developers, and product managers share a unified vision from day one."
      }
    ]'::jsonb
  ),
  (
    'agile-workflows-for-design-teams',
    'Agile Workflows for Design Teams',
    'Adapting agile methodologies to creative processes without sacrificing quality.',
    '/images/services/services-img-2.webp',
    'Team & Workflow',
    '6 min read',
    'Olena Shevchenko',
    'UI/UX Designer',
    '/images/articles/article-author-img-1.webp',
    '2024-02-26 10:00:00+00',
    true,
    '[
      {
        "id": "block-9-0",
        "type": "text",
        "heading": "Scaling your architecture without the pain",
        "shortHeading": "Scaling",
        "text": "By investing in cross-functional collaboration, companies can reduce silos and foster an environment where ideas flow freely. The best products are built when designers, developers, and product managers share a unified vision from day one."
      },
      {
        "id": "block-9-1",
        "type": "quote",
        "text": "The best code is no code at all. Every line you write is a liability. Keep it simple, modular, and easy to delete.",
        "authorName": "Anna Kovalenko"
      },
      {
        "id": "block-9-conclusion",
        "type": "conclusion",
        "heading": "Final thoughts",
        "shortHeading": "Conclusion",
        "text": "Building flexible software is not just a technical choice — it is a business strategy. By choosing adaptability over rigidity, you ensure that your product can grow, evolve, and stay relevant for years to come."
      }
    ]'::jsonb
  ),
  (
    'typescript-best-practices-2024',
    'TypeScript Best Practices for Large Codebases',
    'Proven patterns and conventions that help teams scale TypeScript projects effectively.',
    '/images/services/services-img-3.webp',
    'Tech & Dev',
    '8 min read',
    'Anna Kovalenko',
    'Lead Developer',
    '/images/articles/article-author-img-1.webp',
    '2024-03-04 10:00:00+00',
    false,
    '[
      {
        "id": "block-10-0",
        "type": "text",
        "heading": "The hidden cost of rigid systems",
        "shortHeading": "The hidden cost",
        "text": "Many companies build their digital products with a fixed mindset, focusing only on current needs. While this might work in the short term, it creates massive technical debt later on. When new requirements emerge, a rigid architecture becomes brittle, making every single update expensive and time-consuming.\n\n· Scalability bottlenecks: Hardcoded features limit your ability to handle more users.\n· Slow time-to-market: Deploying new updates feels like moving a mountain.\n· Team frustration: Developers spend more time fixing legacy bugs than innovating."
      },
      {
        "id": "block-10-1",
        "type": "image",
        "image": "/images/services/services-img-4.webp",
        "caption": "An illustrative view of modern workspace and technology."
      },
      {
        "id": "block-10-conclusion",
        "type": "conclusion",
        "heading": "Final thoughts",
        "shortHeading": "Conclusion",
        "text": "Building flexible software is not just a technical choice — it is a business strategy. By choosing adaptability over rigidity, you ensure that your product can grow, evolve, and stay relevant for years to come."
      }
    ]'::jsonb
  )
on conflict (slug) do nothing;

-- link articles to tags
with article_slugs as (
  select id, slug from public.articles
),
tag_slugs as (
  select id, slug from public.tags
)
insert into public.article_tags (article_id, tag_id)
select a.id, t.id from article_slugs a, tag_slugs t
where (a.slug = 'article-1' and t.slug in ('architecture', 'best-practices', 'innovation'))
   or (a.slug = 'article-2' and t.slug in ('team-culture', 'best-practices'))
   or (a.slug = 'article-3' and t.slug in ('product-updates', 'design', 'company-culture'))
   or (a.slug = 'exploring-future-frontend-frameworks' and t.slug in ('frontend', 'performance'))
   or (a.slug = 'soft-bee-expands-new-office' and t.slug in ('company-culture'))
   or (a.slug = 'mastering-remote-collaboration' and t.slug in ('remote-work', 'team-culture'))
   or (a.slug = 'microservices-vs-monoliths-2024' and t.slug in ('architecture', 'backend', 'best-practices'))
   or (a.slug = 'our-journey-to-carbon-neutrality' and t.slug in ('company-culture'))
   or (a.slug = 'agile-workflows-for-design-teams' and t.slug in ('team-culture', 'design'))
   or (a.slug = 'typescript-best-practices-2024' and t.slug in ('frontend', 'best-practices'))
on conflict do nothing;
