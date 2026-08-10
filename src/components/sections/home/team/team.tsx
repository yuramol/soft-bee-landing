'use client';

import 'swiper/css';

import Image from 'next/image';
import { useState } from 'react';
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null);

  const filteredMembers = hideCoFounders
    ? teamContent.members.filter((member) => member.role !== teamContent.coFounderRole)
    : teamContent.members;

  const activeMember = filteredMembers[currentIndex % filteredMembers.length];

  return (
    <section className='relative z-10 w-full'>
      <TeamAnimatedBackground className='-top-100 -bottom-100 -left-1.25 h-[calc(100%+800px)] w-[calc(100%+10px)] md:-left-2.5 md:w-[calc(100%+20px)]' />

      <ComponentContainer className='relative z-10'>
        <div className='flex flex-col xl:h-[calc(100vh-107px)] xl:max-h-[calc(100vh-107px)] xl:flex-row xl:items-stretch xl:gap-10 2xl:gap-50'>
          <div className='pointer-events-none z-20 flex w-full shrink-0 flex-col justify-between pb-0 xl:w-112.75 xl:py-10'>
            <div className='pointer-events-auto mb-10 ml-3 md:ml-10.5 xl:mb-0'>
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
            <div className='relative h-125 w-full min-w-0 lg:h-150 xl:h-full xl:w-125'>
              <Swiper
                onSwiper={setSwiperInstance}
                onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
                loop={true}
                modules={[Autoplay]}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                slidesPerView={1}
                spaceBetween={20}
                breakpoints={{
                  0: { spaceBetween: 20, slidesOffsetBefore: 0 },
                  768: { spaceBetween: -200, slidesOffsetBefore: 0 }
                }}
                className='team-swiper h-full w-full overflow-visible!'
              >
                {Array.from({ length: 30 })
                  .flatMap(() => filteredMembers)
                  .map((member, index) => (
                    <SwiperSlide
                      key={`${member.id}-${index}`}
                      className='group relative flex h-full w-full items-end justify-center opacity-40 transition-all duration-500 [&.swiper-slide-active]:opacity-100'
                    >
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className='origin-bottom scale-75 object-contain object-bottom transition-all duration-500 group-[.swiper-slide-active]:scale-115'
                      />
                    </SwiperSlide>
                  ))}
              </Swiper>

              <div className='pointer-events-none absolute right-0 bottom-10.25 left-0 z-30 flex justify-between px-4 xl:-right-20.5 xl:bottom-15.75 xl:-left-20.5 xl:px-0'>
                <button
                  onClick={() => swiperInstance?.slidePrev()}
                  className='border-muted pointer-events-auto flex size-12.5 shrink-0 cursor-pointer items-center justify-center rounded-full border bg-white shadow-sm transition-colors hover:bg-gray-100'
                >
                  <ArrowLeft className='text-foreground h-5 w-5' />
                </button>
                <button
                  onClick={() => swiperInstance?.slideNext()}
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
