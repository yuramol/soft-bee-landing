'use client';

import 'swiper/css';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Swiper as SwiperClass } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { ComponentContainer } from '@/components/layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { BREAKPOINTS, ROUTES } from '@/constants';
import { cn, getInitialTranslate } from '@/lib/utils';
import { useSwiperPeekAnimation } from '@/hooks/use-swiper-peek-animation';

import { CareersCard } from './careers-card';
import { CareersVideo } from './careers-video';
import careersContent from './content.json';
import { CareersCardData } from './types';

const INITIAL_VISIBLE_CARDS = 2;

const CAREERS_CARDS: CareersCardData[] = careersContent.cards;
const hasCards = CAREERS_CARDS.length > 0;

interface CareersProps {
  className?: string;
}

export const Careers = ({ className }: CareersProps) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [maxTranslate, setMaxTranslate] = useState(0);
  const [startTranslate, setStartTranslate] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null);

  useEffect(() => {
    const updateMaxTranslate = () => {
      const carousel = carouselRef.current;

      if (!carousel) {
        return;
      }

      if (window.innerWidth < BREAKPOINTS.MD) {
        setMaxTranslate(0);
        setStartTranslate(0);
        return;
      }

      setMaxTranslate(carousel.scrollWidth - carousel.clientWidth);
      setStartTranslate(getInitialTranslate(carousel, INITIAL_VISIBLE_CARDS));
    };

    updateMaxTranslate();
    const timeout = setTimeout(updateMaxTranslate, 100);

    window.addEventListener('resize', updateMaxTranslate);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', updateMaxTranslate);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end']
  });

  const translateX = useTransform(scrollYProgress, [0, 1], [startTranslate, -maxTranslate]);

  useSwiperPeekAnimation(swiperInstance);

  return (
    <section className={cn('bg-muted relative', className)}>
      <ComponentContainer>
        <div className='relative z-20 w-full overflow-x-clip rounded-lg bg-white md:rounded-2xl'>
          <div ref={targetRef} className={cn('relative w-full', hasCards ? 'md:h-[400vh]' : 'md:h-[50vh]')}>
            <div
              className={cn(
                'z-10 w-full px-4 py-18.25 pb-23.5 md:flex md:flex-col md:justify-between md:px-10.5 xl:pt-28.75 xl:pb-15',
                hasCards && 'md:sticky md:top-2.5 md:h-[calc(100vh-20px)]'
              )}
            >
              <div className='mb-12 flex flex-col md:mb-0 md:flex-row md:items-start md:justify-between'>
                <div>
                  <Badge title={careersContent.badge} className='bg-muted/50 mb-7.5 w-fit md:mb-10' />
                  <Typography variant='h2' className='text-foreground md:max-w-175 xl:max-w-222'>
                    {careersContent.title}
                  </Typography>
                </div>
                <div className='mt-6 hidden md:block'>
                  <Button variant='default' asChild>
                    <Link href={ROUTES.CAREERS}>{careersContent.cta}</Link>
                  </Button>
                </div>
              </div>

              <div className={cn(hasCards ? 'md:pl-10.5' : 'md:pl-0')}>
                {hasCards ? (
                  <>
                    <motion.div
                      ref={carouselRef}
                      className='hidden snap-x snap-mandatory gap-2.5 overflow-x-auto pr-4 pb-4 will-change-transform md:flex md:snap-none md:overflow-visible md:pr-10.5 md:pb-0'
                      style={{ x: translateX }}
                    >
                      {CAREERS_CARDS.map((card) => (
                        <div key={card.id} className='snap-start'>
                          <CareersCard
                            badge={card.badge}
                            title={card.title}
                            description={card.description}
                            roleDescription={card.vacancyDetails.roleDescription}
                            responsibilities={card.vacancyDetails.responsibilities}
                          />
                        </div>
                      ))}
                    </motion.div>

                    <div className='block overflow-hidden md:hidden'>
                      <Swiper
                        loop={true}
                        slidesPerView='auto'
                        spaceBetween={10}
                        className='w-full overflow-visible!'
                        onSwiper={setSwiperInstance}
                      >
                        {CAREERS_CARDS.map((card) => (
                          <SwiperSlide key={`mobile-${card.id}`} className='w-full!'>
                            <CareersCard
                              badge={card.badge}
                              title={card.title}
                              description={card.description}
                              roleDescription={card.vacancyDetails.roleDescription}
                              responsibilities={card.vacancyDetails.responsibilities}
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  </>
                ) : (
                  <div className='mt-20 flex h-full items-center py-10 md:py-0'>
                    <p className='text-base md:text-lg'>{careersContent.emptyStateMessage}</p>
                  </div>
                )}

                <div className='mt-11.5 block w-full md:hidden'>
                  <Button variant='default' className='w-full' asChild>
                    <Link href={ROUTES.CAREERS}>{careersContent.cta}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <CareersVideo />
        </div>
      </ComponentContainer>
    </section>
  );
};
