import { Suspense } from 'react';
import { Hero } from '@/components/sections/home';
import { InsightsList } from '@/components/sections/insights/insights-list/insights-list';

import heroContent from '@/components/sections/insights/hero/content.json';

export default function InsightsPage() {
  return (
    <>
      <Hero titleSegments={heroContent.titleSegments} description={heroContent.description} />
      <Suspense>
        <InsightsList />
      </Suspense>
    </>
  );
}
