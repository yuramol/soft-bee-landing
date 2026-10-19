import type { Metadata } from 'next';
import nextDynamic from 'next/dynamic';

import { Hero } from '@/components/sections/home/hero';
import careersContent from '@/components/sections/careers/content.json';

export const metadata: Metadata = {
  title: 'Careers | Soft Bee',
  description:
    'Join 27 people building SaaS, healthtech, and AI products. Real ownership from day one, senior mentorship, modern stack, and projects complex enough to grow on.'
};

const Benefits = nextDynamic(() => import('@/components/sections/careers/benefits').then((module) => module.Benefits));
const Vacancies = nextDynamic(() => import('@/components/sections/careers/vacancies').then((module) => module.Vacancies));

export const dynamic = 'force-static';

export default function CareersPage() {
  return (
    <>
      <Hero titleSegments={careersContent.hero.titleSegments} description={careersContent.hero.description} />
      <Benefits />
      <Vacancies />
    </>
  );
}
