import type { Metadata } from 'next';
import { AboutHero, Founders } from '@/components/sections/about';

export const metadata: Metadata = {
  title: 'Company | Soft Bee',
  description:
    "A 27-person engineering team working as your product's core since 2019. We own architecture and delivery — no endless specs, no micromanagement required."
};
import { AboutUs, Careers, Team } from '@/components/sections/home';

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
