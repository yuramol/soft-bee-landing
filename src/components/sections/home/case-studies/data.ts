export interface CaseStudiesItem {
  href: string;
  title: string;
  description: string;
  tools: string[];
  image: string;
}

export const caseStudiesData: CaseStudiesItem[] = [
  {
    title: 'E-commerce & High-Load Platform',
    description:
      'We transformed a legacy retail platform into a high-octane digital ecosystem. Our focus was on eliminating bottlenecks and ensuring the architecture could handle massive traffic spikes during seasonal peaks.',
    tools: ['E-commerce', 'React.js', 'Node.js', 'Microservices', 'AWS', 'HighLoad', 'PostgreSQL', 'Scalability'],
    image: '/images/home/case-studies/case-1.webp',
    href: '/case-studies/e-commerce-and-high-load-platform'
  }
];
