import { Hero } from '@/components/sections/home';

import heroContent from '@/components/sections/insights/hero/content.json';

export default function InsightsPage() {
  return (
    <>
      <Hero titleSegments={heroContent.titleSegments} description={heroContent.description} />
    </>
  );
}
