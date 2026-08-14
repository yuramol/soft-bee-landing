'use client';

import 'swiper/css';

import { useEffect, useState } from 'react';
import { Swiper as SwiperClass } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { DiscussProjectButton } from '@/components/discuss-project-button';
import { ComponentContainer } from '@/components/layout';
import { BREAKPOINTS } from '@/constants';
import { cn } from '@/lib/utils';

import { CaseStudyResultCard } from '@/components/sections/case-studies/data';
import { CaseStudyResultsCard } from './components';
import caseStudyResultsContent from './content.json';

interface CaseStudyResultsProps {
  className?: string;
  description?: string[];
  cards?: CaseStudyResultCard[];
}

export const CaseStudyResults = ({ className, description = [], cards = [] }: CaseStudyResultsProps) => {
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
    <section className={cn('bg-muted relative px-4 pt-29.25 pb-23.75 md:pt-20 md:pb-37.5 lg:px-10.5', className)}>
      <ComponentContainer>
        <div className='flex flex-col xl:flex-row xl:justify-between'>
          <div className='contents w-full flex-col justify-between xl:flex xl:w-[35%]'>
            <div className='order-1 mb-16.5 xl:mb-0'>
              <h2 className='text-foreground mb-6 text-[32px] leading-tight font-semibold xl:mb-8'>{caseStudyResultsContent.title}</h2>
              <div className='flex flex-col gap-1'>
                {description.map((line, idx) => (
                  <p key={idx} className='text-foreground text-[20px] leading-normal font-normal'>
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <div className='order-3 mx-auto lg:mx-0 xl:mt-auto xl:pt-0'>
              <h2 className='text-foreground mb-6 text-[32px] leading-tight font-semibold xl:mb-6'>{caseStudyResultsContent.ctaTitle}</h2>
              <DiscussProjectButton text={caseStudyResultsContent.ctaText} variant='default' size='default' className='w-full lg:w-fit' />
            </div>
          </div>

          <div className='order-2 mb-13.25 w-full xl:mb-0 xl:w-[65%]'>
            <div className='hidden auto-rows-fr gap-2.75 xl:grid xl:grid-cols-[repeat(auto-fit,294px)] xl:justify-end'>
              {cards.map((card) => (
                <CaseStudyResultsCard key={card.id} title={card.title} description={card.description} bottomText={card.bottomText} />
              ))}
            </div>

            <div className='-mx-4 block w-[calc(100%+32px)] overflow-hidden xl:hidden'>
              <Swiper
                loop={true}
                slidesPerView='auto'
                spaceBetween={11}
                className='w-full overflow-visible! pl-4 [&>.swiper-wrapper]:items-stretch!'
                onSwiper={setSwiperInstance}
              >
                {cards.map((card) => (
                  <SwiperSlide key={`mobile-${card.id}`} className='flex! h-auto! w-auto!'>
                    <CaseStudyResultsCard title={card.title} description={card.description} bottomText={card.bottomText} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </ComponentContainer>
    </section>
  );
};
