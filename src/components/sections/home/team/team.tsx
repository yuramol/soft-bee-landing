'use client';

import 'swiper/css';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Swiper as SwiperClass } from 'swiper';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { ArrowLeft, ArrowRight } from '@/assets/icons';
import { ComponentContainer } from '@/components/layout';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/typography';

import { TeamAnimatedBackground } from './components';
import teamContent from './content.json';
import { TeamMemberCard } from './team-member-card';

interface TeamProps {
  hideCoFounders?: boolean;
}

export function Team({ hideCoFounders }: TeamProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null);

  const filteredMembers = hideCoFounders
    ? teamContent.members.filter((member) => member.role !== teamContent.coFounderRole)
    : teamContent.members;

  const activeMember = filteredMembers[currentIndex % filteredMembers.length];

  const handleSlideChange = useCallback((swiper: SwiperClass) => {
    setCurrentIndex(swiper.realIndex);
  }, []);

  const handleSlidePrev = useCallback(() => {
    swiperInstance?.slidePrev();
  }, [swiperInstance]);

  const handleSlideNext = useCallback(() => {
    swiperInstance?.slideNext();
  }, [swiperInstance]);

  const handleSwiper = useCallback((swiper: SwiperClass) => {
    swiper.autoplay.stop();
    setSwiperInstance(swiper);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !swiperInstance) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        syncTeamAutoplay(swiperInstance, entry.isIntersecting);
      },
      { threshold: 0.25 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [swiperInstance]);

  return (
    <section ref={sectionRef} className='relative z-10 w-full'>
      <TeamAnimatedBackground className='-top-100 -bottom-100 -left-1.25 h-[calc(100%+800px)] w-[calc(100%+10px)] md:-left-2.5 md:w-[calc(100%+20px)]' />

      <ComponentContainer className='relative z-10'>
        <div className='flex flex-col xl:h-[calc(100vh-107px)] xl:max-h-[calc(100vh-107px)] xl:flex-row xl:items-stretch xl:gap-10 2xl:gap-50'>
          <div className='pointer-events-none z-20 flex w-full shrink-0 flex-col justify-between pb-0 xl:w-112.75 xl:py-10'>
            <div className='pointer-events-auto ml-3 md:ml-10.5'>
              <Badge title={teamContent.badge} className='mb-7.5 w-fit xl:mb-10' />
              <Typography variant='h2' className='text-foreground max-w-150'>
                {teamContent.title}
              </Typography>
            </div>

            <div className='pointer-events-auto ml-7 hidden xl:block'>
              <TeamMemberCard name={activeMember.name} role={activeMember.role} description={activeMember.description} />
            </div>
          </div>

          <div className='relative z-10 flex min-w-0 flex-1 flex-col items-center xl:h-full xl:flex-row xl:items-end xl:justify-center'>
            <div className='relative h-112 w-full min-w-0 sm:h-125 lg:h-140 xl:h-full xl:w-[clamp(18rem,34vw,31.25rem)]'>
              <Swiper
                onSwiper={handleSwiper}
                onSlideChange={handleSlideChange}
                loop={true}
                modules={[Autoplay]}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                slidesPerView={1}
                spaceBetween={20}
                breakpoints={{
                  0: { spaceBetween: 20, slidesOffsetBefore: 0 },
                  768: { spaceBetween: -120, slidesOffsetBefore: 0 },
                  1536: { spaceBetween: -180, slidesOffsetBefore: 0 }
                }}
                className='team-swiper h-full w-full overflow-visible!'
              >
                {Array.from({ length: 3 }, (_, copyIndex) =>
                  filteredMembers.map((member) => (
                    <SwiperSlide
                      key={`${member.id}-${copyIndex}`}
                      className='group relative h-full w-full overflow-visible! opacity-40 transition-opacity duration-500 [clip-path:inset(0_-50vw_0_-50vw)] [&.swiper-slide-active]:opacity-100'
                    >
                      <TeamMemberPortrait image={member.image} name={member.name} />
                    </SwiperSlide>
                  ))
                )}
              </Swiper>

              <div className='pointer-events-none absolute right-0 bottom-6 left-0 z-30 flex justify-between px-4 sm:bottom-10.25 xl:-right-16 xl:bottom-12 xl:-left-16 xl:px-0'>
                <button
                  onClick={handleSlidePrev}
                  className='border-muted pointer-events-auto flex size-12.5 shrink-0 cursor-pointer items-center justify-center rounded-full border bg-white shadow-sm transition-colors hover:bg-gray-100'
                >
                  <ArrowLeft className='text-foreground h-5 w-5' />
                </button>
                <button
                  onClick={handleSlideNext}
                  className='border-muted pointer-events-auto flex size-12.5 shrink-0 cursor-pointer items-center justify-center rounded-full border bg-white shadow-sm transition-colors hover:bg-gray-100'
                >
                  <ArrowRight className='text-foreground h-5 w-5' />
                </button>
              </div>
            </div>

            <div className='pointer-events-auto relative z-40 mt-0 w-full px-2 xl:hidden'>
              <TeamMemberCard name={activeMember.name} role={activeMember.role} description={activeMember.description} />
            </div>
          </div>
        </div>
      </ComponentContainer>
    </section>
  );
}

function TeamMemberPortrait({ image, name }: TeamMemberPortraitProps) {
  return (
    // 116% frame hangs the legs below the slide; origin 86% keeps that crop line fixed while the next person scales down.
    <div className='pointer-events-none absolute top-0 left-1/2 aspect-2/3 h-[116%] origin-[center_86%] -translate-x-1/2 scale-[0.74] transition-transform duration-500 group-[.swiper-slide-active]:scale-100'>
      <Image src={image} alt={name} fill sizes='(min-width: 1280px) 640px, 90vw' quality={75} className='object-cover object-top' />
    </div>
  );
}

function syncTeamAutoplay(swiper: SwiperClass, isVisible: boolean) {
  if (isVisible) {
    swiper.autoplay.start();
    return;
  }

  swiper.autoplay.stop();
}

interface TeamMemberPortraitProps {
  image: string;
  name: string;
}
