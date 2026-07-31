'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Swiper as SwiperClass } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import { BREAKPOINTS } from '@/constants';
import { ComponentContainer } from '@/components/layout';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/typography';
import { CoFounderCard } from './components';
import { FOUNDERS } from './data';

export const Founders = () => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null);

  useEffect(() => {
    let hasAnimated = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasAnimated && window.innerWidth < BREAKPOINTS.MD) {
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
    <section className='relative z-20 mb-30.5 md:mb-21'>
      <ComponentContainer>
        <div className='w-full overflow-hidden rounded-lg bg-white md:rounded-2xl'>
          <div className='z-10 w-full px-4 pt-18.25 md:px-10.5 xl:pt-31.5'>
            <div className='mb-15.5 flex flex-col items-center text-center xl:mb-20'>
              <Badge title='Founders' className='mb-7.5 w-fit lg:mb-10' />

              <Typography variant='h2' className='max-w-331'>
                <span className='text-foreground'>Soft Bee started with a simple idea: </span>
                <span className='text-foreground/50'>
                  technology should be efficient, not rigid. Just like bees tirelessly crafting the perfect geometry of a honeycomb, we
                  built this project step by step.
                </span>
              </Typography>
            </div>

            <div className='relative flex w-full flex-col items-center xl:mt-45'>
              <div className='relative z-10 w-full xl:hidden'>
                <Swiper
                  loop={true}
                  slidesPerView={1}
                  spaceBetween={16}
                  breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2, spaceBetween: 24 }
                  }}
                  className='w-full overflow-visible!'
                  onSwiper={setSwiperInstance}
                >
                  {FOUNDERS.map((founder) => (
                    <SwiperSlide key={founder.id} className='h-auto'>
                      <CoFounderCard {...founder} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className='relative -mx-4 -mt-8 aspect-10/11 w-[calc(100%+32px)] md:mx-0 md:-mt-40 md:w-full lg:-mt-55 xl:mt-0 xl:aspect-auto xl:h-187.5'>
                <Image
                  src='/images/about/founders.webp'
                  alt='Founders'
                  fill
                  className='origin-bottom translate-x-[24%] scale-[2.5] object-contain object-bottom md:translate-x-[20%] md:scale-[2.2] xl:translate-x-[12%] xl:scale-[1.6]'
                  quality={100}
                  sizes='100vw'
                />

                <div className='absolute bottom-17.5 left-25 z-10 hidden drop-shadow-[0_4px_40px_rgba(0,0,0,0.06)] xl:block 2xl:bottom-30 2xl:left-45'>
                  <CoFounderCard {...FOUNDERS[0]} />
                </div>

                <div className='absolute right-8.25 bottom-23.75 z-10 hidden drop-shadow-[0_4px_40px_rgba(0,0,0,0.06)] xl:block 2xl:right-18.75 2xl:bottom-47.5'>
                  <CoFounderCard {...FOUNDERS[1]} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ComponentContainer>
    </section>
  );
};
