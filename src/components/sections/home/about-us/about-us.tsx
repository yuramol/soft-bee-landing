import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/typography';
import { AboutUsAccordion } from './components';
import { ComponentContainer } from '@/components/layout';

export const AboutUs = () => {
  return (
    <section className='flex w-full flex-col pt-15.5 pb-25 lg:px-10.5 lg:pt-57 lg:pb-35'>
      <ComponentContainer>
        <div className='px-4 lg:px-0'>
          <Badge title='About us' className='mb-7.5 w-fit lg:mb-10' />

          <div className='mb-15.5 flex flex-col items-start justify-between gap-4.75 lg:mb-26.75 lg:flex-row lg:gap-10'>
            <Typography variant='h2' className='text-foreground lg:max-w-175 xl:max-w-233.5'>
              We don’t just write code — we <span className='text-foreground/50'>take ownership</span>. You bring the vision; we handle
              everything it takes to ship it, from architecture to release.
            </Typography>

            <Typography variant='h5' className='text-foreground lg:max-w-85 xl:max-w-153'>
              Soft Bee works as your product&apos;s engineering core: we make the architectural decisions, flag the risks, and deliver
              without needing constant oversight - while keeping you informed at every step.
            </Typography>
          </div>
        </div>

        <AboutUsAccordion />
      </ComponentContainer>
    </section>
  );
};
