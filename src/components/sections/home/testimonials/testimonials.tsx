'use client';

import 'swiper/css';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Swiper as SwiperClass } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { ComponentContainer } from '@/components/layout';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/typography';
import { BREAKPOINTS } from '@/constants';
import { getInitialTranslate } from '@/lib/utils';
import { useSwiperPeekAnimation } from '@/hooks/use-swiper-peek-animation';

import { TestimonialCard } from './testimonial-card';
import testimonialsContent from './content.json';

export interface TestimonialItem {
  id: string | number;
  quote: string;
  avatar: string;
  name: string;
  role: string;
  logo: string;
  link: string;
}

interface TestimonialsProps {
  cards?: TestimonialItem[];
}

const INITIAL_VISIBLE_CARDS = 2;

export const Testimonials = ({ cards = testimonialsContent.cards }: TestimonialsProps) => {
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
    <section className='relative z-10 -mb-10 md:-mb-10'>
      <ComponentContainer>
        <div className='w-full overflow-x-clip rounded-lg bg-white pb-4.25 md:rounded-2xl md:pb-18.75'>
          <div
            ref={targetRef}
            className='relative w-full md:h-(--scroll-height)'
            style={{ '--scroll-height': `calc(100vh + ${(cards.length - 1) * 60}vh)` } as React.CSSProperties}
          >
            <div className='z-10 w-full px-4 pt-18.25 md:sticky md:top-2.5 md:flex md:h-[calc(100vh-20px)] md:flex-col md:justify-between md:px-10.5 md:pb-10 xl:pt-28.75'>
              <div className='mb-12 flex flex-col md:mb-0 md:flex-row md:items-start md:justify-between'>
                <div>
                  <Badge title={testimonialsContent.badge} className='bg-muted/50 mb-7.5 w-fit md:mb-10' />
                  <Typography variant='h2' className='text-foreground md:max-w-175 xl:max-w-210'>
                    {testimonialsContent.title}
                  </Typography>
                </div>
              </div>

              <div className='md:pl-10.5'>
                <motion.div
                  ref={carouselRef}
                  className='hidden snap-x snap-mandatory gap-2.5 overflow-x-auto pr-4 pb-4 will-change-transform md:flex md:snap-none md:overflow-visible md:pr-10.5 md:pb-0'
                  style={{ x: translateX }}
                >
                  {cards.map((card) => (
                    <div key={card.id} className='snap-start'>
                      <TestimonialCard
                        quote={card.quote}
                        avatar={card.avatar}
                        name={card.name}
                        role={card.role}
                        logo={card.logo}
                        link={card.link}
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
                    {cards.map((card) => (
                      <SwiperSlide key={`mobile-${card.id}`} className='w-full!'>
                        <TestimonialCard
                          quote={card.quote}
                          avatar={card.avatar}
                          name={card.name}
                          role={card.role}
                          logo={card.logo}
                          link={card.link}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ComponentContainer>
    </section>
  );
};
