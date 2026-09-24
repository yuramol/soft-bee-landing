-- seed: insights articles from mockInsights (data.ts)
-- trimmed to 18 articles for a lean local seed
-- prioritized: article-1, article-3, article-10

-- insert category-based tags (derived from article categories)
insert into public.tags (name, slug) values
  ('Tech & Dev', 'tech-dev'),
  ('Team & Workflow', 'team-workflow'),
  ('Company news', 'company-news')
on conflict (slug) do nothing;

-- insert articles (18 from mocks)
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
    '2024-01-01T00:00:00.000Z',
    true,
    '[{"id":"block-0-0","type":"text","heading":"The hidden cost of rigid systems","shortHeading":"The hidden cost","text":"Many companies build their digital products with a fixed mindset, focusing only on current needs. While this might work in the short term, it creates massive technical debt later on. When new requirements emerge, a rigid architecture becomes brittle, making every single update expensive and time-consuming.\\n\\n· Scalability bottlenecks: Hardcoded features limit your ability to handle more users.\\n· Slow time-to-market: Deploying new updates feels like moving a mountain.\\n· Team frustration: Developers spend more time fixing legacy bugs than innovating."},{"id":"block-0-1","type":"quote","text":"Innovation distinguishes between a leader and a follower. To stay ahead, we must continuously challenge our own assumptions and embrace change.","authorName":"Anna Kovalenko"},{"id":"block-0-conclusion","type":"conclusion","heading":"Final thoughts","shortHeading":"Conclusion","text":"Building flexible software is not just a technical choice — it is a business strategy. By choosing adaptability over rigidity, you ensure that your product can grow, evolve, and stay relevant for years to come."}]'::jsonb
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
    '2024-01-02T00:00:00.000Z',
    false,
    '[{"id":"block-1-0","type":"text","heading":"Finding the balance between structure and flexibility","shortHeading":"Balance","text":"Automation is no longer a luxury—it''s a necessity. From testing to deployment, automating repetitive tasks frees up human creativity to solve complex, high-value problems."},{"id":"block-1-1","type":"quote","text":"Design is not just what it looks like and feels like. Design is how it works. Our goal is to bridge the gap between aesthetics and functionality.","authorName":"Dmytro Petrenko"},{"id":"block-1-2","type":"image","image":"/images/services/services-img-4.webp","caption":"An illustrative view of modern workspace and technology."},{"id":"block-1-conclusion","type":"conclusion","heading":"Final thoughts","shortHeading":"Conclusion","text":"Building flexible software is not just a technical choice — it is a business strategy. By choosing adaptability over rigidity, you ensure that your product can grow, evolve, and stay relevant for years to come."}]'::jsonb
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
    '2024-01-03T00:00:00.000Z',
    true,
    '[{"id":"block-2-0","type":"text","heading":"Why modern teams need adaptable workflows","shortHeading":"Workflows","text":"Creating a resilient system does not mean working without rules. On the contrary, it requires a smart, modular framework. Think of it as a well-organized ecosystem where every component has a clear purpose but can adapt or be replaced without breaking the entire structure."},{"id":"block-2-1","type":"quote","text":"The best code is no code at all. Every line you write is a liability. Keep it simple, modular, and easy to delete.","authorName":"Olena Shevchenko"},{"id":"block-2-2","type":"image","image":"/images/services/services-img-1.webp","caption":"An illustrative view of modern workspace and technology."},{"id":"block-2-3","type":"text","heading":"Empathy in software engineering","shortHeading":"Empathy","text":"When we talk about future-proofing, we often think of technology choices. However, the most crucial element is the team''s ability to adapt. Providing developers with the right tools and a supportive culture is the foundation of any successful long-term project."},{"id":"block-2-conclusion","type":"conclusion","heading":"Final thoughts","shortHeading":"Conclusion","text":"Building flexible software is not just a technical choice — it is a business strategy. By choosing adaptability over rigidity, you ensure that your product can grow, evolve, and stay relevant for years to come."}]'::jsonb
  ),
  (
    'article-4',
    'Exploring the Future of Frontend Frameworks',
    'A look into how modern frameworks are optimizing performance and developer experience.',
    '/images/services/services-img-4.webp',
    'Tech & Dev',
    '6 min read',
    'Anna Kovalenko',
    'Lead Developer',
    '/images/articles/article-author-img-1.webp',
    '2024-01-04T00:00:00.000Z',
    false,
    '[{"id":"block-3-0","type":"text","heading":"The evolution of digital product design","shortHeading":"Evolution","text":"By investing in cross-functional collaboration, companies can reduce silos and foster an environment where ideas flow freely. The best products are built when designers, developers, and product managers share a unified vision from day one."},{"id":"block-3-1","type":"quote","text":"Creating a resilient system does not mean working without rules. On the contrary, it requires a smart, modular framework. Think of it as a well-organized ecosystem where every component has a clear purpose but can adapt or be replaced without breaking the entire structure.","authorName":"Anna Kovalenko"},{"id":"block-3-conclusion","type":"conclusion","heading":"Final thoughts","shortHeading":"Conclusion","text":"Building flexible software is not just a technical choice — it is a business strategy. By choosing adaptability over rigidity, you ensure that your product can grow, evolve, and stay relevant for years to come."}]'::jsonb
  ),
  (
    'article-5',
    'Soft Bee Expands to New Office',
    'We are thrilled to announce our new hub for innovation and collaboration.',
    '/images/services/services-img-1.webp',
    'Company news',
    '3 min read',
    'Dmytro Petrenko',
    'Product Manager',
    '/images/articles/article-author-img-1.webp',
    '2024-01-05T00:00:00.000Z',
    false,
    '[{"id":"block-4-0","type":"text","heading":"Scaling your architecture without the pain","shortHeading":"Scaling","text":"When we talk about future-proofing, we often think of technology choices. However, the most crucial element is the team''s ability to adapt. Providing developers with the right tools and a supportive culture is the foundation of any successful long-term project."},{"id":"block-4-1","type":"quote","text":"Innovation distinguishes between a leader and a follower. To stay ahead, we must continuously challenge our own assumptions and embrace change.","authorName":"Dmytro Petrenko"},{"id":"block-4-2","type":"image","image":"/images/services/services-img-3.webp","caption":"An illustrative view of modern workspace and technology."},{"id":"block-4-conclusion","type":"conclusion","heading":"Final thoughts","shortHeading":"Conclusion","text":"Building flexible software is not just a technical choice — it is a business strategy. By choosing adaptability over rigidity, you ensure that your product can grow, evolve, and stay relevant for years to come."}]'::jsonb
  ),
  (
    'article-6',
    'Mastering Remote Collaboration',
    'Essential tools and practices for keeping distributed teams aligned and productive.',
    '/images/services/services-img-2.webp',
    'Team & Workflow',
    '7 min read',
    'Olena Shevchenko',
    'UI/UX Designer',
    '/images/articles/article-author-img-1.webp',
    '2024-01-06T00:00:00.000Z',
    false,
    '[{"id":"block-5-0","type":"text","heading":"Empathy in software engineering","shortHeading":"Empathy","text":"Many companies build their digital products with a fixed mindset, focusing only on current needs. While this might work in the short term, it creates massive technical debt later on. When new requirements emerge, a rigid architecture becomes brittle, making every single update expensive and time-consuming.\\n\\n· Scalability bottlenecks: Hardcoded features limit your ability to handle more users.\\n· Slow time-to-market: Deploying new updates feels like moving a mountain.\\n· Team frustration: Developers spend more time fixing legacy bugs than innovating."},{"id":"block-5-1","type":"quote","text":"Design is not just what it looks like and feels like. Design is how it works. Our goal is to bridge the gap between aesthetics and functionality.","authorName":"Olena Shevchenko"},{"id":"block-5-2","type":"image","image":"/images/services/services-img-4.webp","caption":"An illustrative view of modern workspace and technology."},{"id":"block-5-3","type":"text","heading":"Why modern teams need adaptable workflows","shortHeading":"Workflows","text":"Creating a resilient system does not mean working without rules. On the contrary, it requires a smart, modular framework. Think of it as a well-organized ecosystem where every component has a clear purpose but can adapt or be replaced without breaking the entire structure."},{"id":"block-5-conclusion","type":"conclusion","heading":"Final thoughts","shortHeading":"Conclusion","text":"Building flexible software is not just a technical choice — it is a business strategy. By choosing adaptability over rigidity, you ensure that your product can grow, evolve, and stay relevant for years to come."}]'::jsonb
  ),
  (
    'article-7',
    'Building Without Friction: Why "Soft" Technology is the Future of Innovation - Volume 2',
    'Discover how flexible software architecture and empathetic design are shaping the next generation of digital products.',
    '/images/services/services-img-3.webp',
    'Tech & Dev',
    '5 min read',
    'Anna Kovalenko',
    'Lead Developer',
    '/images/articles/article-author-img-1.webp',
    '2024-01-07T00:00:00.000Z',
    false,
    '[{"id":"block-6-0","type":"text","heading":"The hidden cost of rigid systems","shortHeading":"The hidden cost","text":"Automation is no longer a luxury—it''s a necessity. From testing to deployment, automating repetitive tasks frees up human creativity to solve complex, high-value problems."},{"id":"block-6-1","type":"quote","text":"The best code is no code at all. Every line you write is a liability. Keep it simple, modular, and easy to delete.","authorName":"Anna Kovalenko"},{"id":"block-6-conclusion","type":"conclusion","heading":"Final thoughts","shortHeading":"Conclusion","text":"Building flexible software is not just a technical choice — it is a business strategy. By choosing adaptability over rigidity, you ensure that your product can grow, evolve, and stay relevant for years to come."}]'::jsonb
  ),
  (
    'article-8',
    'The Honeycomb Structure: Organizing Team Workflows for Maximum Efficiency - Volume 2',
    'How to apply the geometric precision of bees to your team''s daily tasks, remote communication, and project management.',
    '/images/services/services-img-4.webp',
    'Team & Workflow',
    '8 min read',
    'Dmytro Petrenko',
    'Product Manager',
    '/images/articles/article-author-img-1.webp',
    '2024-01-08T00:00:00.000Z',
    false,
    '[{"id":"block-7-0","type":"text","heading":"Finding the balance between structure and flexibility","shortHeading":"Balance","text":"Creating a resilient system does not mean working without rules. On the contrary, it requires a smart, modular framework. Think of it as a well-organized ecosystem where every component has a clear purpose but can adapt or be replaced without breaking the entire structure."},{"id":"block-7-1","type":"quote","text":"Creating a resilient system does not mean working without rules. On the contrary, it requires a smart, modular framework. Think of it as a well-organized ecosystem where every component has a clear purpose but can adapt or be replaced without breaking the entire structure.","authorName":"Dmytro Petrenko"},{"id":"block-7-2","type":"image","image":"/images/services/services-img-2.webp","caption":"An illustrative view of modern workspace and technology."},{"id":"block-7-conclusion","type":"conclusion","heading":"Final thoughts","shortHeading":"Conclusion","text":"Building flexible software is not just a technical choice — it is a business strategy. By choosing adaptability over rigidity, you ensure that your product can grow, evolve, and stay relevant for years to come."}]'::jsonb
  ),
  (
    'article-9',
    'Behind the Buzz: How We Built Our Latest Feature with User Comfort in Mind - Volume 2',
    'A deep dive into our development process. We''re sharing the challenges, the wins, and the code behind our newest update.',
    '/images/services/services-img-1.webp',
    'Company news',
    '4 min read',
    'Olena Shevchenko',
    'UI/UX Designer',
    '/images/articles/article-author-img-1.webp',
    '2024-01-09T00:00:00.000Z',
    false,
    '[{"id":"block-8-0","type":"text","heading":"Why modern teams need adaptable workflows","shortHeading":"Workflows","text":"By investing in cross-functional collaboration, companies can reduce silos and foster an environment where ideas flow freely. The best products are built when designers, developers, and product managers share a unified vision from day one."},{"id":"block-8-1","type":"quote","text":"Innovation distinguishes between a leader and a follower. To stay ahead, we must continuously challenge our own assumptions and embrace change.","authorName":"Olena Shevchenko"},{"id":"block-8-2","type":"image","image":"/images/services/services-img-3.webp","caption":"An illustrative view of modern workspace and technology."},{"id":"block-8-3","type":"text","heading":"Empathy in software engineering","shortHeading":"Empathy","text":"Many companies build their digital products with a fixed mindset, focusing only on current needs. While this might work in the short term, it creates massive technical debt later on. When new requirements emerge, a rigid architecture becomes brittle, making every single update expensive and time-consuming.\\n\\n· Scalability bottlenecks: Hardcoded features limit your ability to handle more users.\\n· Slow time-to-market: Deploying new updates feels like moving a mountain.\\n· Team frustration: Developers spend more time fixing legacy bugs than innovating."},{"id":"block-8-conclusion","type":"conclusion","heading":"Final thoughts","shortHeading":"Conclusion","text":"Building flexible software is not just a technical choice — it is a business strategy. By choosing adaptability over rigidity, you ensure that your product can grow, evolve, and stay relevant for years to come."}]'::jsonb
  ),
  (
    'article-10',
    'Exploring the Future of Frontend Frameworks - Volume 2',
    'A look into how modern frameworks are optimizing performance and developer experience.',
    '/images/services/services-img-2.webp',
    'Tech & Dev',
    '6 min read',
    'Anna Kovalenko',
    'Lead Developer',
    '/images/articles/article-author-img-1.webp',
    '2024-01-10T00:00:00.000Z',
    true,
    '[{"id":"block-9-0","type":"text","heading":"The evolution of digital product design","shortHeading":"Evolution","text":"When we talk about future-proofing, we often think of technology choices. However, the most crucial element is the team''s ability to adapt. Providing developers with the right tools and a supportive culture is the foundation of any successful long-term project."},{"id":"block-9-1","type":"quote","text":"Design is not just what it looks like and feels like. Design is how it works. Our goal is to bridge the gap between aesthetics and functionality.","authorName":"Anna Kovalenko"},{"id":"block-9-conclusion","type":"conclusion","heading":"Final thoughts","shortHeading":"Conclusion","text":"Building flexible software is not just a technical choice — it is a business strategy. By choosing adaptability over rigidity, you ensure that your product can grow, evolve, and stay relevant for years to come."}]'::jsonb
  ),
  (
    'article-11',
    'Soft Bee Expands to New Office - Volume 2',
    'We are thrilled to announce our new hub for innovation and collaboration.',
    '/images/services/services-img-3.webp',
    'Company news',
    '3 min read',
    'Dmytro Petrenko',
    'Product Manager',
    '/images/articles/article-author-img-1.webp',
    '2024-01-11T00:00:00.000Z',
    false,
    '[{"id":"block-10-0","type":"text","heading":"Scaling your architecture without the pain","shortHeading":"Scaling","text":"Many companies build their digital products with a fixed mindset, focusing only on current needs. While this might work in the short term, it creates massive technical debt later on. When new requirements emerge, a rigid architecture becomes brittle, making every single update expensive and time-consuming.\\n\\n· Scalability bottlenecks: Hardcoded features limit your ability to handle more users.\\n· Slow time-to-market: Deploying new updates feels like moving a mountain.\\n· Team frustration: Developers spend more time fixing legacy bugs than innovating."},{"id":"block-10-1","type":"quote","text":"The best code is no code at all. Every line you write is a liability. Keep it simple, modular, and easy to delete.","authorName":"Dmytro Petrenko"},{"id":"block-10-2","type":"image","image":"/images/services/services-img-1.webp","caption":"An illustrative view of modern workspace and technology."},{"id":"block-10-conclusion","type":"conclusion","heading":"Final thoughts","shortHeading":"Conclusion","text":"Building flexible software is not just a technical choice — it is a business strategy. By choosing adaptability over rigidity, you ensure that your product can grow, evolve, and stay relevant for years to come."}]'::jsonb
  ),
  (
    'article-12',
    'Mastering Remote Collaboration - Volume 2',
    'Essential tools and practices for keeping distributed teams aligned and productive.',
    '/images/services/services-img-4.webp',
    'Team & Workflow',
    '7 min read',
    'Olena Shevchenko',
    'UI/UX Designer',
    '/images/articles/article-author-img-1.webp',
    '2024-01-12T00:00:00.000Z',
    false,
    '[{"id":"block-11-0","type":"text","heading":"Empathy in software engineering","shortHeading":"Empathy","text":"Automation is no longer a luxury—it''s a necessity. From testing to deployment, automating repetitive tasks frees up human creativity to solve complex, high-value problems."},{"id":"block-11-1","type":"quote","text":"Creating a resilient system does not mean working without rules. On the contrary, it requires a smart, modular framework. Think of it as a well-organized ecosystem where every component has a clear purpose but can adapt or be replaced without breaking the entire structure.","authorName":"Olena Shevchenko"},{"id":"block-11-2","type":"image","image":"/images/services/services-img-2.webp","caption":"An illustrative view of modern workspace and technology."},{"id":"block-11-3","type":"text","heading":"Why modern teams need adaptable workflows","shortHeading":"Workflows","text":"By investing in cross-functional collaboration, companies can reduce silos and foster an environment where ideas flow freely. The best products are built when designers, developers, and product managers share a unified vision from day one."},{"id":"block-11-conclusion","type":"conclusion","heading":"Final thoughts","shortHeading":"Conclusion","text":"Building flexible software is not just a technical choice — it is a business strategy. By choosing adaptability over rigidity, you ensure that your product can grow, evolve, and stay relevant for years to come."}]'::jsonb
  ),
  (
    'article-13',
    'Building Without Friction: Why "Soft" Technology is the Future of Innovation - Volume 3',
    'Discover how flexible software architecture and empathetic design are shaping the next generation of digital products.',
    '/images/services/services-img-1.webp',
    'Tech & Dev',
    '5 min read',
    'Anna Kovalenko',
    'Lead Developer',
    '/images/articles/article-author-img-1.webp',
    '2024-01-13T00:00:00.000Z',
    false,
    '[{"id":"block-12-0","type":"text","heading":"The hidden cost of rigid systems","shortHeading":"The hidden cost","text":"Creating a resilient system does not mean working without rules. On the contrary, it requires a smart, modular framework. Think of it as a well-organized ecosystem where every component has a clear purpose but can adapt or be replaced without breaking the entire structure."},{"id":"block-12-1","type":"quote","text":"Innovation distinguishes between a leader and a follower. To stay ahead, we must continuously challenge our own assumptions and embrace change.","authorName":"Anna Kovalenko"},{"id":"block-12-conclusion","type":"conclusion","heading":"Final thoughts","shortHeading":"Conclusion","text":"Building flexible software is not just a technical choice — it is a business strategy. By choosing adaptability over rigidity, you ensure that your product can grow, evolve, and stay relevant for years to come."}]'::jsonb
  ),
  (
    'article-14',
    'The Honeycomb Structure: Organizing Team Workflows for Maximum Efficiency - Volume 3',
    'How to apply the geometric precision of bees to your team''s daily tasks, remote communication, and project management.',
    '/images/services/services-img-2.webp',
    'Team & Workflow',
    '8 min read',
    'Dmytro Petrenko',
    'Product Manager',
    '/images/articles/article-author-img-1.webp',
    '2024-01-14T00:00:00.000Z',
    false,
    '[{"id":"block-13-0","type":"text","heading":"Finding the balance between structure and flexibility","shortHeading":"Balance","text":"By investing in cross-functional collaboration, companies can reduce silos and foster an environment where ideas flow freely. The best products are built when designers, developers, and product managers share a unified vision from day one."},{"id":"block-13-1","type":"quote","text":"Design is not just what it looks like and feels like. Design is how it works. Our goal is to bridge the gap between aesthetics and functionality.","authorName":"Dmytro Petrenko"},{"id":"block-13-2","type":"image","image":"/images/services/services-img-4.webp","caption":"An illustrative view of modern workspace and technology."},{"id":"block-13-conclusion","type":"conclusion","heading":"Final thoughts","shortHeading":"Conclusion","text":"Building flexible software is not just a technical choice — it is a business strategy. By choosing adaptability over rigidity, you ensure that your product can grow, evolve, and stay relevant for years to come."}]'::jsonb
  ),
  (
    'article-15',
    'Behind the Buzz: How We Built Our Latest Feature with User Comfort in Mind - Volume 3',
    'A deep dive into our development process. We''re sharing the challenges, the wins, and the code behind our newest update.',
    '/images/services/services-img-3.webp',
    'Company news',
    '4 min read',
    'Olena Shevchenko',
    'UI/UX Designer',
    '/images/articles/article-author-img-1.webp',
    '2024-01-15T00:00:00.000Z',
    false,
    '[{"id":"block-14-0","type":"text","heading":"Why modern teams need adaptable workflows","shortHeading":"Workflows","text":"When we talk about future-proofing, we often think of technology choices. However, the most crucial element is the team''s ability to adapt. Providing developers with the right tools and a supportive culture is the foundation of any successful long-term project."},{"id":"block-14-1","type":"quote","text":"The best code is no code at all. Every line you write is a liability. Keep it simple, modular, and easy to delete.","authorName":"Olena Shevchenko"},{"id":"block-14-2","type":"image","image":"/images/services/services-img-1.webp","caption":"An illustrative view of modern workspace and technology."},{"id":"block-14-3","type":"text","heading":"Empathy in software engineering","shortHeading":"Empathy","text":"Automation is no longer a luxury—it''s a necessity. From testing to deployment, automating repetitive tasks frees up human creativity to solve complex, high-value problems."},{"id":"block-14-conclusion","type":"conclusion","heading":"Final thoughts","shortHeading":"Conclusion","text":"Building flexible software is not just a technical choice — it is a business strategy. By choosing adaptability over rigidity, you ensure that your product can grow, evolve, and stay relevant for years to come."}]'::jsonb
  ),
  (
    'article-16',
    'Exploring the Future of Frontend Frameworks - Volume 3',
    'A look into how modern frameworks are optimizing performance and developer experience.',
    '/images/services/services-img-4.webp',
    'Tech & Dev',
    '6 min read',
    'Anna Kovalenko',
    'Lead Developer',
    '/images/articles/article-author-img-1.webp',
    '2024-01-16T00:00:00.000Z',
    false,
    '[{"id":"block-15-0","type":"text","heading":"The evolution of digital product design","shortHeading":"Evolution","text":"Many companies build their digital products with a fixed mindset, focusing only on current needs. While this might work in the short term, it creates massive technical debt later on. When new requirements emerge, a rigid architecture becomes brittle, making every single update expensive and time-consuming.\\n\\n· Scalability bottlenecks: Hardcoded features limit your ability to handle more users.\\n· Slow time-to-market: Deploying new updates feels like moving a mountain.\\n· Team frustration: Developers spend more time fixing legacy bugs than innovating."},{"id":"block-15-1","type":"quote","text":"Creating a resilient system does not mean working without rules. On the contrary, it requires a smart, modular framework. Think of it as a well-organized ecosystem where every component has a clear purpose but can adapt or be replaced without breaking the entire structure.","authorName":"Anna Kovalenko"},{"id":"block-15-conclusion","type":"conclusion","heading":"Final thoughts","shortHeading":"Conclusion","text":"Building flexible software is not just a technical choice — it is a business strategy. By choosing adaptability over rigidity, you ensure that your product can grow, evolve, and stay relevant for years to come."}]'::jsonb
  ),
  (
    'article-17',
    'Soft Bee Expands to New Office - Volume 3',
    'We are thrilled to announce our new hub for innovation and collaboration.',
    '/images/services/services-img-1.webp',
    'Company news',
    '3 min read',
    'Dmytro Petrenko',
    'Product Manager',
    '/images/articles/article-author-img-1.webp',
    '2024-01-17T00:00:00.000Z',
    false,
    '[{"id":"block-16-0","type":"text","heading":"Scaling your architecture without the pain","shortHeading":"Scaling","text":"Automation is no longer a luxury—it''s a necessity. From testing to deployment, automating repetitive tasks frees up human creativity to solve complex, high-value problems."},{"id":"block-16-1","type":"quote","text":"Innovation distinguishes between a leader and a follower. To stay ahead, we must continuously challenge our own assumptions and embrace change.","authorName":"Dmytro Petrenko"},{"id":"block-16-2","type":"image","image":"/images/services/services-img-3.webp","caption":"An illustrative view of modern workspace and technology."},{"id":"block-16-conclusion","type":"conclusion","heading":"Final thoughts","shortHeading":"Conclusion","text":"Building flexible software is not just a technical choice — it is a business strategy. By choosing adaptability over rigidity, you ensure that your product can grow, evolve, and stay relevant for years to come."}]'::jsonb
  ),
  (
    'article-18',
    'Mastering Remote Collaboration - Volume 3',
    'Essential tools and practices for keeping distributed teams aligned and productive.',
    '/images/services/services-img-2.webp',
    'Team & Workflow',
    '7 min read',
    'Olena Shevchenko',
    'UI/UX Designer',
    '/images/articles/article-author-img-1.webp',
    '2024-01-18T00:00:00.000Z',
    false,
    '[{"id":"block-17-0","type":"text","heading":"Empathy in software engineering","shortHeading":"Empathy","text":"Creating a resilient system does not mean working without rules. On the contrary, it requires a smart, modular framework. Think of it as a well-organized ecosystem where every component has a clear purpose but can adapt or be replaced without breaking the entire structure."},{"id":"block-17-1","type":"quote","text":"Design is not just what it looks like and feels like. Design is how it works. Our goal is to bridge the gap between aesthetics and functionality.","authorName":"Olena Shevchenko"},{"id":"block-17-2","type":"image","image":"/images/services/services-img-4.webp","caption":"An illustrative view of modern workspace and technology."},{"id":"block-17-3","type":"text","heading":"Why modern teams need adaptable workflows","shortHeading":"Workflows","text":"When we talk about future-proofing, we often think of technology choices. However, the most crucial element is the team''s ability to adapt. Providing developers with the right tools and a supportive culture is the foundation of any successful long-term project."},{"id":"block-17-conclusion","type":"conclusion","heading":"Final thoughts","shortHeading":"Conclusion","text":"Building flexible software is not just a technical choice — it is a business strategy. By choosing adaptability over rigidity, you ensure that your product can grow, evolve, and stay relevant for years to come."}]'::jsonb
  )

on conflict (slug) do nothing;

-- link articles to their category tags
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

