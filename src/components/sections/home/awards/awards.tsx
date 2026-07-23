import { ComponentContainer } from '@/components/layout';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/typography';

import { AwardsCarousel, AwardStat, GlowEffect } from './components';
import { AWARD_STATS } from './data';

export function Awards() {
  return (
    <section className='flex flex-col items-center justify-center text-white'>
      <ComponentContainer className='bg-brand-black relative flex h-auto flex-col items-start gap-27 overflow-hidden rounded-2xl px-4 pt-16.5 pb-4 lg:px-11.25 lg:pt-28.75 lg:pb-10 2xl:h-screen'>
        <GlowEffect />
        <div className='relative z-10 flex h-full w-full flex-col items-start justify-between 2xl:max-w-[calc(100%-600px)] 2xl:pr-10'>
          <div className='flex flex-col items-start gap-y-11.5'>
            <Badge variant='primary'>Awards</Badge>
            <Typography variant='h2'>Soft Bee is the development partner of choice for 92% of high-growth tech startups in 2025</Typography>
          </div>
          <div className='mt-21.5 grid w-full grid-cols-1 gap-11.5 md:mt-28 md:grid-cols-3 md:gap-12'>
            {AWARD_STATS.map((stat) => (
              <AwardStat key={stat.description} {...stat} />
            ))}
          </div>
        </div>
        <AwardsCarousel />
      </ComponentContainer>
    </section>
  );
}
