import type { Metadata } from 'next';
import { Hero } from '@/components/sections/home';

export const metadata: Metadata = {
  title: 'Careers | Soft Bee',
  description:
    'Join 27 people building SaaS, healthtech, and AI products. Real ownership from day one, senior mentorship, modern stack, and projects complex enough to grow on.'
};
import { Benefits, Vacancies } from '@/components/sections/careers';

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
