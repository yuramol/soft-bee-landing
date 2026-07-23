'use client';

import 'swiper/css';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Swiper as SwiperClass } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/typography';
import { BREAKPOINTS } from '@/constants';

import { ServiceCard } from './service-card';

const CARD_HIDDEN_OFFSET = 40;

const MOCK_CARDS = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  title: `Web App Development ${i}`,
  description: 'We brings together engineers, designers, and analysts to create dependable solutions.'
}));

export const Services = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [maxTranslate, setMaxTranslate] = useState(0);
  const [startTranslate, setStartTranslate] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null);

  useEffect(() => {
    const updateMaxTranslate = () => {
      if (carouselRef.current) {
        if (window.innerWidth < BREAKPOINTS.MD) {
          setMaxTranslate(0);
          setStartTranslate(0);
        } else {
          setMaxTranslate(carouselRef.current.scrollWidth - carouselRef.current.clientWidth);
          setStartTranslate(carouselRef.current.clientWidth + CARD_HIDDEN_OFFSET);
        }
      }
    };

    // Initial calculate + add a small delay to ensure fonts/layout are loaded
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

  useEffect(() => {
    // Mobile peek animation for Swiper
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
    <section ref={targetRef} className='relative w-full md:h-[400vh]'>
      <div className='z-10 w-full px-4 py-18.25 md:sticky md:top-2.5 md:flex md:h-[calc(100vh-20px)] md:flex-col md:justify-between md:px-10.5 xl:pt-28.75 xl:pb-15'>
        <div className='mb-12 md:mb-0'>
          <Badge title='Services' className='bg-muted/50 mb-7.5 w-fit md:mb-10' />

          <div>
            <Typography variant='h2' className='text-foreground md:max-w-175 xl:max-w-233.5'>
              We build high-performance digital products with scalable code and seamless execution
            </Typography>
          </div>
        </div>

        <div className='md:pl-10.5'>
          {/* Desktop Horizontal Scroll */}
          <motion.div
            ref={carouselRef}
            className='hidden snap-x snap-mandatory gap-2.5 overflow-x-auto pr-4 pb-4 will-change-transform md:flex md:snap-none md:overflow-visible md:pr-10.5 md:pb-0'
            style={{ x: translateX }}
          >
            {MOCK_CARDS.map((card) => (
              <div key={card.id} className='snap-start'>
                <ServiceCard title={card.title} description={card.description} />
              </div>
            ))}
          </motion.div>

          {/* Mobile Swiper */}
          <div className='block overflow-hidden md:hidden'>
            <Swiper loop={true} slidesPerView='auto' spaceBetween={10} className='w-full overflow-visible!' onSwiper={setSwiperInstance}>
              {MOCK_CARDS.map((card) => (
                <SwiperSlide key={`mobile-${card.id}`} className='w-full!'>
                  <ServiceCard title={card.title} description={card.description} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};
