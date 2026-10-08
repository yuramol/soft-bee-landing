import nextDynamic from 'next/dynamic';

import { ComponentContainer } from '@/components/layout';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/typography';
import { BenefitCard } from './components';
import { BENEFITS } from './data';

const BenefitsMobile = nextDynamic(() => import('./benefits-mobile').then((module) => module.BenefitsMobile));

export function Benefits() {
  return (
    <section className='bg-muted w-full overflow-x-hidden md:overflow-visible md:bg-transparent'>
      <ComponentContainer>
        <div className='hidden md:flex md:flex-col md:px-10 md:pt-34.75 md:pb-41.25'>
          <div className='mb-18.25'>
            <Badge title='Benefits & Perks' className='mb-10 w-fit' />
            <Typography variant='h2' className='text-foreground'>
              Life at Soft Bee: Why You&apos;ll Love It Here
            </Typography>
          </div>

          <div className='grid gap-2.5 md:grid-cols-2 xl:grid-cols-4'>
            {BENEFITS.map((benefit, index) => (
              <BenefitCard
                key={index}
                title={benefit.title}
                description={benefit.description}
                type={benefit.type}
                layout={benefit.layout}
                image={benefit.image}
              />
            ))}
          </div>
        </div>

        <BenefitsMobile />
      </ComponentContainer>
    </section>
  );
}
