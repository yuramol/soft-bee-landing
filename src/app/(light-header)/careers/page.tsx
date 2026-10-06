import type { Metadata } from 'next';
import nextDynamic from 'next/dynamic';

import { Hero } from '@/components/sections/home/hero';

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
      <Hero
        titleSegments={[{ text: 'Shape the Next Generation of "Soft" Tech' }]}
        description="Explore our open roles, bring your unique skills, and let's build impactful digital products together."
      />
      <Benefits />
      <Vacancies />
    </>
  );
}
