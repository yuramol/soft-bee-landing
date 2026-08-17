import { Hero } from '@/components/sections/home';
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
