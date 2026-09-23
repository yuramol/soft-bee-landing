import { Suspense } from 'react';
import { Hero } from '@/components/sections/home';
import { InsightsListServer } from '@/components/sections/insights/insights-list/insights-list-server';
import { Loader } from '@/components/ui/loader';

import heroContent from '@/components/sections/insights/hero/content.json';

export default async function InsightsPage({ searchParams }: { searchParams: Promise<{ tab?: string; q?: string; page?: string }> }) {
  return (
    <>
      <Hero titleSegments={heroContent.titleSegments} description={heroContent.description} />
      <Suspense
        fallback={
          <div className='flex min-h-[400px] items-center justify-center'>
            <Loader className='text-brand-black h-12 w-12' />
          </div>
        }
      >
        <InsightsListServer searchParams={searchParams} />
      </Suspense>
    </>
  );
}
