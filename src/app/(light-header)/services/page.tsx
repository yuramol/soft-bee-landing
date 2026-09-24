import type { Metadata } from 'next';
import { Hero } from '@/components/sections/home';

export const metadata: Metadata = {
  title: 'Services | Soft Bee',
  description:
    'Full-cycle development: web and mobile apps, front-end and back-end, SaaS and B2B platforms, UI/UX design, AI integrations, product support and scaling.'
};
import { ServicesList } from '@/components/sections/services';

import heroContent from '@/components/sections/services/hero/content.json';

export default function ServicesPage() {
  return (
    <>
      <Hero titleSegments={heroContent.titleSegments} description={heroContent.description} />
      <ServicesList />
    </>
  );
}
