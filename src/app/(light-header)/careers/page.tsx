import { Hero } from '@/components/sections/home';
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
