import { ComponentContainer } from '@/components/layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

export function CaseStudies() {
  return (
    <section className='flex w-full flex-col pt-15.5 lg:px-10.5 lg:pt-55'>
      <ComponentContainer className='flex flex-col gap-y-45'>
        <div className='flex flex-col items-center px-4 text-center lg:px-0'>
          <Badge title='Case studies' className='mb-7.5 w-fit lg:mb-10' />

          <div className='flex flex-col items-start justify-between gap-4.75 lg:mb-12.5 lg:flex-row lg:gap-10'>
            <Typography variant='h2' className='text-foreground lg:max-w-175 xl:max-w-250'>
              At Soft Bee, we combine{' '}
              <span className='text-foreground/50'>technical precision with strategic thinking to solve complex business challenges.</span>
            </Typography>
          </div>
          <Button className='w-43'>View more</Button>
        </div>
      </ComponentContainer>
    </section>
  );
}
