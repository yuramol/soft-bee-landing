'use client';

import 'swiper/css';
import { useState } from 'react';
import { Swiper as SwiperClass } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/typography';
import { BREAKPOINTS } from '@/constants';
import { useSwiperPeekAnimation } from '@/hooks/use-swiper-peek-animation';
import { BenefitCard } from './components';
import { BENEFITS } from './data';

export function BenefitsMobile() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null);

  useSwiperPeekAnimation(swiperInstance, BREAKPOINTS.LG);

  return (
    <div className='flex flex-col pt-25.25 pb-25 md:hidden'>
      <div className='mb-10 px-2.75'>
        <Badge title='Benefits & Perks' className='mb-7.5 w-fit' />
        <Typography variant='h2' className='text-foreground leading-tight'>
          Life at Soft Bee: Why you&apos;ll love It here
        </Typography>
      </div>

      <div className='w-full overflow-hidden px-2.75 sm:overflow-visible sm:px-0'>
        <Swiper
          loop={true}
          slidesPerView={'auto'}
          spaceBetween={10}
          breakpoints={{
            0: {
              slidesOffsetBefore: 0,
              slidesOffsetAfter: 0
            },
            640: {
              slidesOffsetBefore: 11,
              slidesOffsetAfter: 11
            }
          }}
          onSwiper={setSwiperInstance}
          className='w-full overflow-visible!'
        >
          {BENEFITS.map((benefit, index) => (
            <SwiperSlide key={index} className='h-auto w-full! sm:w-90!'>
              <BenefitCard
                title={benefit.title}
                description={benefit.description}
                type={benefit.type}
                layout={benefit.layout}
                image={benefit.image}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
