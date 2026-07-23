import { ComponentContainer } from '@/components/layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

import CaseStudiesItem from './components/case-studies-item';
import { caseStudiesData } from './data';

export function CaseStudies() {
  return (
    <section className='flex w-full flex-col pt-17 lg:pt-53.25'>
      <ComponentContainer className='flex flex-col gap-y-17 lg:gap-y-45'>
        <div className='flex flex-col items-start px-4 lg:items-center lg:px-0 lg:text-center'>
          <Badge title='Case studies' className='mb-7.5 w-fit lg:mb-10' />

          <div className='flex flex-col items-start justify-between gap-4.75 lg:mb-12.5 lg:flex-row lg:gap-10'>
            <Typography variant='h2' className='text-foreground lg:max-w-175 xl:max-w-250'>
              At Soft Bee, we combine{' '}
              <span className='text-foreground/50'>technical precision with strategic thinking to solve complex business challenges.</span>
            </Typography>
          </div>
          <Button className='hidden w-43 lg:block'>View more</Button>
        </div>
        <CaseStudiesItem item={caseStudiesData[0]} />
      </ComponentContainer>
    </section>
  );
}
