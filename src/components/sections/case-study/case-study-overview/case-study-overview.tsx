import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/typography';
import { ComponentContainer } from '@/components/layout';
import Image from 'next/image';

interface CaseStudyOverviewProps {
  overviewTitle: string;
  overviewDescription: string;
  overviewImages: string[];
}

export const CaseStudyOverview = ({ overviewTitle, overviewDescription, overviewImages }: CaseStudyOverviewProps) => (
  <section className='mt-12 mb-10 flex w-full flex-col md:mb-0 lg:mt-24'>
    <ComponentContainer>
      <div className='px-4 lg:px-0'>
        <Badge title='Overview' className='mb-7.5 w-fit lg:mb-10' />

        <div className='mb-34 flex flex-col items-start justify-between gap-4.75 lg:mb-20 lg:flex-row lg:gap-10 xl:mb-30 2xl:mb-46'>
          <Typography variant='h2' className='text-foreground lg:max-w-175 xl:max-w-233.5'>
            {overviewTitle}
          </Typography>

          <Typography variant='h5' className='text-foreground lg:max-w-85 xl:max-w-153'>
            {overviewDescription}
          </Typography>
        </div>
      </div>

      <div className='flex flex-col gap-2.5 lg:flex-row'>
        {overviewImages.map((img, idx) => (
          <div key={idx} className='relative w-full min-[1800px]:h-248.5! lg:h-150 lg:flex-1 xl:h-187.5'>
            <Image
              src={img}
              alt={`Overview image ${idx + 1}`}
              width={1272}
              height={1400}
              className='h-auto w-full rounded-md min-[1800px]:h-248.5! lg:h-150 lg:rounded-4xl lg:object-cover xl:h-187.5'
            />
          </div>
        ))}
      </div>
    </ComponentContainer>
  </section>
);
