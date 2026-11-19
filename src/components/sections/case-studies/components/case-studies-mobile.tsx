'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Typography } from '@/components/ui/typography';
import { BREAKPOINTS } from '@/constants';
import { useSwiperPeekAnimation } from '@/hooks/use-swiper-peek-animation';
import { cn } from '@/lib/utils';
import { DeferredImage } from '@/components/sections/services/services-list/components/deferred-image';
import type { CaseStudyListing } from '../data';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper';
import 'swiper/css';

interface CaseStudiesMobileProps {
  caseStudies: CaseStudyListing[];
}

export function CaseStudiesMobile({ caseStudies }: CaseStudiesMobileProps) {
  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useSwiperPeekAnimation(swiperInstance, BREAKPOINTS.LG);

  function handleSlideChange(swiper: SwiperClass) {
    setActiveIndex(swiper.realIndex);
  }

  return (
    <div className='overflow-hidden lg:hidden'>
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        slidesPerView='auto'
        spaceBetween={10}
        className='w-full overflow-visible!'
        onSwiper={setSwiperInstance}
        onSlideChange={handleSlideChange}
      >
        {caseStudies.map((study, index) => {
          const isLcpImage = index === 0;
          const isActive = index === activeIndex;

          return (
            <SwiperSlide key={study.id} className='w-full!'>
              <Link href={study.link} className='group flex flex-col gap-6.75' aria-current={isActive ? 'true' : undefined}>
                <div className={cn('flex items-start gap-3 transition-opacity duration-300', isActive ? 'opacity-100' : 'opacity-40')}>
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
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
