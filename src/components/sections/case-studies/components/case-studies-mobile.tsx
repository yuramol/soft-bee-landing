import Link from 'next/link';
import Image from 'next/image';
import { Typography } from '@/components/ui/typography';
import { DeferredImage } from '@/components/sections/services/services-list/components/deferred-image';
import type { CaseStudyListing } from '../data';

interface CaseStudiesMobileProps {
  caseStudies: CaseStudyListing[];
}

export function CaseStudiesMobile({ caseStudies }: CaseStudiesMobileProps) {
  return (
    <div className='flex flex-col gap-19.25 lg:hidden'>
      {caseStudies.map((study, index) => {
        const isLcpImage = index === 0;

        return (
          <Link key={study.id} href={study.link} className='group flex flex-col gap-6.75'>
            <div className='flex items-start gap-3'>
              <Typography variant='h2' tag='h2' className='text-[40px] leading-none font-normal tracking-tight'>
                {study.shortTitle || study.title}
              </Typography>
              <Typography variant='body3' tag='span' className='leading-10'>
                [{study.year}]
              </Typography>
            </div>
            <div className='relative aspect-1673/940 w-full overflow-hidden rounded-[16px] bg-gray-100 shadow-sm'>
              {isLcpImage ? (
                <Image
                  src={study.mobileImage}
                  alt={`${study.title} case study`}
                  fill
                  className='object-cover transition-transform duration-700 group-hover:scale-105'
                  sizes='100vw'
                  priority
                  fetchPriority='high'
                  quality={75}
                />
              ) : (
                <DeferredImage
                  src={study.mobileImage}
                  alt={`${study.title} case study`}
                  sizes='100vw'
                  className='object-cover transition-transform duration-700 group-hover:scale-105'
                />
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
