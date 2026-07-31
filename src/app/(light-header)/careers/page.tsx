import { Hero } from '@/components/sections/home';
import { Benefits } from '@/components/sections/careers/benefits';

export default function CareersPage() {
  return (
    <>
      <Hero
        titleSegments={[{ text: 'Shape the Next Generation of "Soft" Tech' }]}
        description="Explore our open roles, bring your unique skills, and let's build impactful digital products together."
      />
      <Benefits />
    </>
  );
}
