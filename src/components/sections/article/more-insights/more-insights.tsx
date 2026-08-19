'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import 'swiper/css';
import { Swiper as SwiperClass } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { ComponentContainer } from '@/components/layout';
import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { InsightCard } from '@/components/sections/insights/insights-list/components';
import { ROUTES } from '@/constants/routes';
import type { InsightArticle } from '@/components/sections/insights/insights-list/data';
import content from './content.json';
import { Badge } from '@/components/ui/badge';

interface MoreInsightsProps {
  articles: InsightArticle[];
}

export function MoreInsights({ articles }: MoreInsightsProps) {
  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null);

  useEffect(() => {
    let hasAnimated = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasAnimated && window.innerWidth < 1024) {
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

  if (!articles || articles.length === 0) return null;

  return (
    <section className='z-20 px-4 pt-6.75 md:px-10.5 lg:pt-10'>
      <ComponentContainer>
        <div className='mb-8.5 flex flex-col gap-y-7.5 lg:mb-17 lg:flex-row lg:items-start lg:justify-between lg:gap-y-0'>
          <div className='flex flex-col items-start space-y-7.5 md:space-y-10'>
            <Badge title={content.badge} />

            <Typography variant='h2' className='max-w-180'>
              {content.title}
            </Typography>
          </div>

          <Button asChild variant='default' className='w-full md:w-42'>
            <Link href={ROUTES.INSIGHTS}>{content.buttonText}</Link>
          </Button>
        </div>

        {/* Mobile Swiper */}
        <div className='-mx-4 lg:hidden'>
          <Swiper
            loop={true}
            slidesPerView='auto'
            spaceBetween={10}
            className='w-full overflow-visible! pl-4!'
            onSwiper={setSwiperInstance}
          >
            {articles.map((article) => (
              <SwiperSlide key={`mobile-${article.id}`} className='w-[85vw]! min-w-90!'>
                <InsightCard article={article} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop Grid */}
        <div className='hidden lg:grid lg:grid-cols-3 lg:gap-2.5'>
          {articles.map((article) => (
            <InsightCard key={`desktop-${article.id}`} article={article} />
          ))}
        </div>
      </ComponentContainer>
    </section>
  );
}
