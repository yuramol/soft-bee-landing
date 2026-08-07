'use client';

import 'swiper/css';
import { useEffect, useState } from 'react';
import { Swiper as SwiperClass } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { ComponentContainer } from '@/components/layout';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/typography';
import { BREAKPOINTS } from '@/constants';
import { BenefitCard } from './components';
import { BENEFITS } from './data';

export const Benefits = () => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null);

  useEffect(() => {
    let hasAnimated = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasAnimated && window.innerWidth < BREAKPOINTS.LG) {
              hasAnimated = true;
              if (swiperInstance && swiperInstance.wrapperEl) {
                setTimeout(() => {
                  const wrapper = swiperInstance.wrapperEl;
                  const currentTranslate = swiperInstance.translate;

                  wrapper.style.transition = 'transform 0.6s ease-out';
                  wrapper.style.transform = `translate3d(${currentTranslate - 60}px, 0, 0)`;

                  setTimeout(() => {
                    wrapper.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;
                    setTimeout(() => {
                      wrapper.style.transition = '';
                      swiperInstance.setTranslate(currentTranslate);
                    }, 600);
                  }, 700);
                }, 500);
              }
            }
          } else {
            hasAnimated = false;
          }
        });
      },
      { threshold: 0.8, rootMargin: '0px 0px -10% 0px' }
    );

    if (swiperInstance && swiperInstance.el) {
      observer.observe(swiperInstance.el);
    }
    return () => observer.disconnect();
  }, [swiperInstance]);

  return (
    <section className='bg-muted w-full overflow-x-hidden md:overflow-visible md:bg-transparent'>
      <ComponentContainer>
        <div className='hidden md:flex md:flex-col md:px-10 md:pt-34.75 md:pb-41.25'>
          <div className='mb-18.25'>
            <Badge title='Benefits & Perks' className='mb-10 w-fit' />
            <Typography variant='h2' className='text-foreground'>
              Life at Soft Bee: Why You&apos;ll Love It Here
            </Typography>
          </div>

          <div className='grid gap-2.5 md:grid-cols-2 xl:grid-cols-4'>
            {BENEFITS.map((benefit, index) => (
              <BenefitCard
                key={index}
                title={benefit.title}
                description={benefit.description}
                type={benefit.type}
                layout={benefit.layout}
                image={benefit.image}
              />
            ))}
          </div>
        </div>

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
      </ComponentContainer>
    </section>
  );
};
