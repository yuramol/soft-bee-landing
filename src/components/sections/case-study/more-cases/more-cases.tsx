'use client';

import 'swiper/css';

import { useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Swiper as SwiperClass } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { ROUTES } from '@/constants';

import { ComponentContainer } from '@/components/layout';
import { Typography } from '@/components/ui/typography';
import { CASE_STUDIES } from '@/components/sections/case-studies/data';

import { DesktopCard } from './components';
import { useSwiperPeekAnimation } from '@/hooks/use-swiper-peek-animation';

const DESKTOP_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

function subscribeMediaQuery(query: string, onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(query);
  mediaQuery.addEventListener('change', onStoreChange);
  return () => mediaQuery.removeEventListener('change', onStoreChange);
}

function getMediaQueryMatches(query: string) {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(query).matches;
}

interface MoreCasesProps {
  currentId: string;
}

export function MoreCases({ currentId }: MoreCasesProps) {
  const router = useRouter();
  const cases = CASE_STUDIES.filter((c) => c.id !== currentId);

  const isDesktopPointer = useSyncExternalStore(
    (onStoreChange) => subscribeMediaQuery(DESKTOP_POINTER_QUERY, onStoreChange),
    () => getMediaQueryMatches(DESKTOP_POINTER_QUERY),
    () => false
  );

  function handleCardClick(id: string) {
    router.push(`/case-studies/${id}`);
  }

  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null);

  useSwiperPeekAnimation(swiperInstance);

  return (
    <section className='relative z-10 w-full pt-30 pb-24 md:pt-50 md:pb-0 2xl:pt-80'>
      <ComponentContainer className='md:hidden'>
        <Swiper slidesPerView='auto' spaceBetween={10} loop={true} className='w-full overflow-visible!' onSwiper={setSwiperInstance}>
          {cases.map((c) => (
            <SwiperSlide key={c.id} className='w-[calc(100vw-32px)]! cursor-pointer'>
              <Link href={`/${ROUTES.CASE_STUDIES}/${c.id}`} className='group flex w-full flex-col pl-4'>
                <div className='mb-6.5 flex flex-col gap-3 px-1'>
                  <Typography
                    variant='h1'
                    className='text-foreground group-hover:text-primary text-[40px] leading-tight font-normal transition-colors'
                  >
                    {c.title}
                  </Typography>
                  <Typography variant='body1' className='text-foreground/80 text-[20px] font-normal'>
                    [{c.year}]
                  </Typography>
                </div>
                <div className='relative aspect-4/3 w-full overflow-hidden rounded-2xl'>
                  <Image src={c.image} alt={c.title} fill className='object-cover' />
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </ComponentContainer>

      <div className='hidden w-full md:block'>
        {cases.map((c, index) => (
          <DesktopCard key={c.id} c={c} index={index} isDesktopPointer={isDesktopPointer} onClick={() => handleCardClick(c.id)} />
        ))}
      </div>
    </section>
  );
}
