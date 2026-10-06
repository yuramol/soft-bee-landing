'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { DeferredImage } from '@/components/sections/services/services-list/components/deferred-image';
import type { CaseStudyListing } from '../data';

interface CaseStudiesDesktopProps {
  caseStudies: CaseStudyListing[];
}

export function CaseStudiesDesktop({ caseStudies }: CaseStudiesDesktopProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStudy = caseStudies[activeIndex];

  function handleActivate(index: number) {
    setActiveIndex(index);
  }

  return (
    <div className='hidden w-full items-center justify-between lg:flex'>
      <div className='flex flex-col gap-8 py-8 lg:gap-17.5'>
        {caseStudies.map((study, index) => (
          <Link
            key={study.id}
            href={study.link}
            className='group flex w-fit items-start'
            onMouseEnter={() => handleActivate(index)}
            onClick={() => handleActivate(index)}
          >
            <Typography
              variant='display1'
              className={cn(
                'leading-none font-normal tracking-tight transition-colors duration-300',
                activeIndex === index ? 'text-brand-black' : 'text-brand-black/40 group-hover:text-brand-black/80'
              )}
            >
              {study.shortTitle || study.title}
            </Typography>
            <Typography
              variant='body2'
              tag='span'
              className={cn(
                'mt-3 ml-3 text-base font-medium transition-colors duration-300 lg:mt-4 lg:ml-4 lg:text-xl',
                activeIndex === index ? 'text-brand-black' : 'text-brand-black/40 group-hover:text-brand-black/80'
              )}
            >
              [{study.year}]
            </Typography>
          </Link>
        ))}
      </div>

      <div className='w-1/2 shrink-0'>
        <Link href={activeStudy.link} className='group block w-full'>
          <div className='relative aspect-1673/940 w-full overflow-hidden rounded-[16px] transition-transform duration-500 group-hover:scale-[1.02]'>
            <DeferredImage
              key={activeStudy.id}
              src={activeStudy.image}
              alt={`${activeStudy.title} case study`}
              sizes='50vw'
              className='rounded-2xl object-cover'
            />
          </div>
        </Link>
      </div>
    </div>
  );
}
