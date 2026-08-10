'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ComponentContainer } from '@/components/layout';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { CaseStudiesMobile } from './components';
import { CASE_STUDIES } from './data';

export const CaseStudies = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className='bg-brand-white text-brand-black w-full rounded-2xl px-4 pt-40.25 pb-7.25 shadow-sm lg:px-5 lg:pt-37.25 lg:pb-41.5 lg:shadow-none'>
      <ComponentContainer className='w-full'>
        {/* Mobile View */}
        <CaseStudiesMobile caseStudies={CASE_STUDIES} />

        {/* Desktop View */}
        <div className='hidden w-full items-center justify-between lg:flex'>
          <div className='flex flex-col gap-8 py-8 lg:gap-17.5'>
            {CASE_STUDIES.map((study, index) => (
              <Link
                key={study.id}
                href={study.link}
                className='group flex w-fit items-start'
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
              >
                <Typography
                  variant='display1'
                  className={cn(
                    'leading-none font-normal tracking-tight transition-colors duration-300',
                    activeIndex === index ? 'text-brand-black' : 'text-brand-black/40 group-hover:text-brand-black/80'
                  )}
                >
                  {study.title}
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
            <Link href={CASE_STUDIES[activeIndex].link} className='group block w-full'>
              <div className='relative w-full overflow-hidden rounded-[16px] bg-gray-50 shadow-md transition-transform duration-500 group-hover:scale-[1.02]'>
                <Image
                  src={CASE_STUDIES[activeIndex].image}
                  alt={`${CASE_STUDIES[activeIndex].title} case study`}
                  width={1000}
                  height={750}
                  className='h-auto w-full object-cover'
                  sizes='50vw'
                  priority
                />
              </div>
            </Link>
          </div>
        </div>
      </ComponentContainer>
    </div>
  );
};
