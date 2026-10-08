import type { Metadata } from 'next';
import nextDynamic from 'next/dynamic';

import { AboutHero } from '@/components/sections/about';
import { AboutUs, Careers } from '@/components/sections/home';

export const metadata: Metadata = {
  title: 'Company | Soft Bee',
  description:
    "A 27-person engineering team working as your product's core since 2019. We own architecture and delivery — no endless specs, no micromanagement required."
};

const Founders = nextDynamic(() => import('@/components/sections/about/founders').then((module) => module.Founders));
const Team = nextDynamic(() => import('@/components/sections/home/team').then((module) => module.Team));

export const dynamic = 'force-static';

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutUs />
      <Founders />
      <Team hideCoFounders />
      <Careers className='z-10 -mb-10 bg-transparent md:-mb-10' />
    </>
  );
}
