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

import { TestimonialCard } from './testimonial-card';

const CARD_HIDDEN_OFFSET = 40;

const MOCK_CARDS = Array.from({ length: 6 }).map((_, i) => ({
  id: i,
  quote:
    "Working with Soft Bee felt like adding an elite engineering engine to our team. They didn't just write code; they optimized our entire development workflow, allowing us to hit the market two months ahead of schedule.",
  avatar: '/images/home/testimonials/testimonial-avatar-01.webp',
  name: 'Mark R',
  role: 'Founder at NexaStream',
  logo: '/images/home/testimonials/testimonial-logo-01.webp',
  link: 'https://clutch.co/profile/soft-bee'
}));

export const Testimonials = () => {
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
    <section className='relative z-10 -mb-10 md:-mb-10'>
      <ComponentContainer>
        <div className='w-full overflow-x-clip rounded-lg bg-white pb-4.25 md:rounded-2xl md:pb-18.75'>
          <div ref={targetRef} className='relative w-full md:h-[400vh]'>
            <div className='z-10 w-full px-4 pt-18.25 md:sticky md:top-2.5 md:flex md:h-[calc(100vh-20px)] md:flex-col md:justify-between md:px-10.5 md:pb-10 xl:pt-28.75'>
              <div className='mb-12 flex flex-col md:mb-0 md:flex-row md:items-start md:justify-between'>
                <div>
                  <Badge title='Testimonials' className='bg-muted/50 mb-7.5 w-fit md:mb-10' />
                  <Typography variant='h2' className='text-foreground md:max-w-175 xl:max-w-210'>
                    Building Digital Success Together: What Our Partners Say
                  </Typography>
                </div>
              </div>

              <div className='md:pl-10.5'>
                <motion.div
                  ref={carouselRef}
                  className='hidden snap-x snap-mandatory gap-2.5 overflow-x-auto pr-4 pb-4 will-change-transform md:flex md:snap-none md:overflow-visible md:pr-10.5 md:pb-0'
                  style={{ x: translateX }}
                >
                  {MOCK_CARDS.map((card) => (
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
                    {MOCK_CARDS.map((card) => (
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
