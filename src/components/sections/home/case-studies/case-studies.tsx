'use client';

import 'swiper/css';
import 'swiper/css/pagination';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import { ComponentContainer } from '@/components/layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

import CaseStudiesItem from './components/case-studies-item';
import caseStudiesContent from './content.json';
import { ROUTES } from '@/constants';
import Link from 'next/link';

import './style.css';

export function CaseStudies() {
  return (
    <section className='flex w-full flex-col pt-17 lg:pt-53.25'>
      <ComponentContainer className='flex flex-col gap-y-17 lg:gap-y-45'>
        <div className='flex flex-col items-start px-4 lg:items-center lg:px-0 lg:text-center'>
          <Badge title={caseStudiesContent.badge} className='mb-7.5 w-fit lg:mb-10' />

          <div className='flex flex-col items-start justify-between gap-4.75 lg:mb-12.5 lg:flex-row lg:gap-10'>
            <Typography variant='h2' className='text-foreground lg:max-w-175 xl:max-w-250'>
              {caseStudiesContent.title.map((segment, index) => (
                <span key={index}>{segment.text}</span>
              ))}
            </Typography>
          </div>
          <Button variant='default' className='hidden lg:flex' asChild>
            <Link href={ROUTES.CASE_STUDIES}>{caseStudiesContent.cta}</Link>
          </Button>
        </div>

        <div className='flex w-full flex-col gap-y-17 lg:hidden'>
          {caseStudiesContent.items
            .filter((item) => item.title)
            .map((item, index) => (
              <div key={index}>
                <CaseStudiesItem item={item} />
              </div>
            ))}
        </div>

        <div className='hidden w-full lg:block [&_.swiper-pagination]:bottom-0 [&_.swiper-wrapper]:pb-16'>
          <Swiper
            modules={[Autoplay, Pagination]}
            loop={true}
            autoplay={{
              delay: 7000,
              disableOnInteraction: false
            }}
            pagination={{ clickable: true }}
            spaceBetween={30}
            slidesPerView={1}
            className='case-studies-swiper w-full'
          >
            {caseStudiesContent.items
              .filter((item) => item.title)
              .map((item, index) => (
                <SwiperSlide key={index}>
                  <CaseStudiesItem item={item} />
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </ComponentContainer>
    </section>
  );
}
