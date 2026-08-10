import { ComponentContainer } from '@/components/layout';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/typography';

import { AboutUsAccordion } from './components';
import aboutUsContent from './content.json';

export function AboutUs() {
  return (
    <section className='flex w-full flex-col pt-15.5 pb-25 lg:px-10.5 lg:pt-50 lg:pb-35'>
      <ComponentContainer>
        <div className='px-4 lg:px-0'>
          <Badge title={aboutUsContent.badge} className='mb-7.5 w-fit lg:mb-10' />

          <div className='mb-15.5 flex flex-col items-start justify-between gap-4.75 lg:mb-26.75 lg:flex-row lg:gap-10'>
            <Typography variant='h2' className='text-foreground lg:max-w-175 xl:max-w-233.5'>
              {aboutUsContent.title.map((segment, index) =>
                segment.className ? (
                  <span key={index} className={segment.className}>
                    {segment.text}
                  </span>
                ) : (
                  <span key={index}>{segment.text}</span>
                )
              )}
            </Typography>

            <Typography variant='h5' className='text-foreground lg:max-w-85 xl:max-w-153'>
              {aboutUsContent.description}
            </Typography>
          </div>
        </div>

        <AboutUsAccordion cards={aboutUsContent.cards} />
      </ComponentContainer>
    </section>
  );
}
