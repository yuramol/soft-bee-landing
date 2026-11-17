'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { FocusEvent, MouseEvent } from 'react';
import Link from 'next/link';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { DeferredImage } from '@/components/sections/services/services-list/components/deferred-image';
import type { CaseStudyListing } from '../data';
import {
  attachWheelStepper,
  getLoopOffset,
  getPickerLevel,
  getPickerSlots,
  observeFitScales,
  PICKER_ROWS_AROUND_ACTIVE,
  wrapIndex
} from './project-picker';
import type { PickerLevel, StepDirection } from './project-picker';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper';
import 'swiper/css';

interface CaseStudiesDesktopProps {
  caseStudies: CaseStudyListing[];
}

export function CaseStudiesDesktop({ caseStudies }: CaseStudiesDesktopProps) {
  // Unbounded step counter: the list is a ring, so the counter keeps the scroll direction after wrapping.
  const [position, setPosition] = useState(0);
  // Per-slot scale that keeps long titles inside the column; empty until measured on the client.
  const [fitScales, setFitScales] = useState<number[]>([]);
  const swiperRef = useRef<SwiperClass | null>(null);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const total = caseStudies.length;
  const activeIndex = total > 0 ? wrapIndex(position, total) : 0;
  const slots = getPickerSlots(position, total);

  useEffect(() => {
    const picker = pickerRef.current;
    if (!picker) return;

    function handleWheelStep(direction: StepDirection) {
      if (direction > 0) swiperRef.current?.slideNext();
      else swiperRef.current?.slidePrev();
    }

    return attachWheelStepper(picker, { onStep: handleWheelStep });
  }, []);

  // Layout effect: measure before paint so long titles never flash at full size.
  useLayoutEffect(() => {
    const picker = pickerRef.current;
    if (!picker) return;

    return observeFitScales(picker, setFitScales);
  }, [caseStudies]);

  function handleSwiper(swiper: SwiperClass) {
    swiperRef.current = swiper;
  }

  function handleSlideChange(swiper: SwiperClass) {
    // Read realIndex now: the updater runs later, when Swiper may already be destroyed (Next keeps the left page hidden),
    // and an undefined index would turn the position into NaN and hide every row.
    const realIndex = swiper.realIndex;
    if (!Number.isInteger(realIndex) || total === 0) return;

    setPosition((previous) => previous + getLoopOffset(realIndex - wrapIndex(previous, total), total));
  }

  function handlePickerMouseEnter() {
    swiperRef.current?.autoplay?.stop();
  }

  function handlePickerMouseLeave() {
    swiperRef.current?.autoplay?.start();
  }

  function handlePickerBlur(event: FocusEvent<HTMLDivElement>) {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    swiperRef.current?.autoplay?.start();
  }

  function handleItemClick(event: MouseEvent<HTMLAnchorElement>) {
    const index = getItemIndex(event.currentTarget);
    if (index === activeIndex) return;

    // First click centres the project; clicking the centred project opens the case study.
    event.preventDefault();
    swiperRef.current?.slideToLoop(index);
  }

  function handleItemFocus(event: FocusEvent<HTMLAnchorElement>) {
    // Mouse clicks also focus links in some browsers; only keyboard focus should move the picker.
    if (!event.currentTarget.matches(':focus-visible')) return;

    swiperRef.current?.autoplay?.stop();
    swiperRef.current?.slideToLoop(getItemIndex(event.currentTarget));
  }

  return (
    <div className='hidden w-full items-center justify-between gap-10 lg:flex'>
      <div
        ref={pickerRef}
        className='relative min-w-0 flex-1 overflow-hidden'
        style={PICKER_STYLE}
        onMouseEnter={handlePickerMouseEnter}
        onMouseLeave={handlePickerMouseLeave}
        onBlur={handlePickerBlur}
      >
        <ul className='relative h-full'>
          {slots.map(({ slot, index, offset, isCopy }) => {
            const study = caseStudies[index];
            const level = getPickerLevel(offset);

            return (
              <li
                key={slot}
                aria-hidden={isCopy || undefined}
                className='absolute inset-x-0 top-0 flex items-center transition-transform duration-500 ease-out motion-reduce:transition-none'
                style={getRowStyle(offset)}
              >
                <Link
                  href={study.link}
                  data-index={index}
                  data-slot={slot}
                  tabIndex={isCopy ? -1 : undefined}
                  aria-current={level === 'active' && !isCopy ? 'true' : undefined}
                  className={cn(
                    'flex w-fit shrink-0 origin-left items-start whitespace-nowrap transition-[transform,opacity,color] duration-500 ease-out motion-reduce:transition-none',
                    LEVEL_CLASSES[level]
                  )}
                  style={getItemStyle(level, fitScales[slot])}
                  onClick={handleItemClick}
                  onFocus={handleItemFocus}
                >
                  <Typography variant='display1' tag={isCopy ? 'span' : undefined} className='leading-none font-normal tracking-tight'>
                    {study.shortTitle || study.title}
                  </Typography>
                  <Typography variant='body2' tag='span' className='mt-3 ml-3 text-base font-medium lg:mt-4 lg:ml-4 lg:text-xl'>
                    [{study.year}]
                  </Typography>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className='w-1/2 shrink-0'>
        <Swiper
          modules={[Autoplay]}
          direction='vertical'
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          allowTouchMove={false}
          onSwiper={handleSwiper}
          onSlideChange={handleSlideChange}
          className='aspect-1673/940 w-full overflow-hidden rounded-[16px]'
        >
          {caseStudies.map((study) => (
            <SwiperSlide key={study.id}>
              <Link href={study.link} className='group block w-full' tabIndex={-1}>
                <div className='relative aspect-1673/940 w-full overflow-hidden rounded-[16px] transition-transform duration-500 group-hover:scale-[1.02]'>
                  <DeferredImage src={study.image} alt={`${study.title} case study`} sizes='50vw' className='rounded-2xl object-cover' />
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

function getItemIndex(element: HTMLElement): number {
  return Number(element.dataset.index);
}

function getRowStyle(offset: number) {
  return {
    height: ROW_HEIGHT_PX,
    transform: `translateY(${(offset + PICKER_ROWS_AROUND_ACTIVE) * ROW_HEIGHT_PX}px)`
  };
}

function getItemStyle(level: PickerLevel, fitScale = 1) {
  return { transform: `scale(${LEVEL_SCALES[level] * fitScale})` };
}

/** Fixed row height keeps the active row centred; levels change only `transform`/`opacity`, so layout never shifts. */
const ROW_HEIGHT_PX = 120;

const PICKER_STYLE = { height: ROW_HEIGHT_PX * (PICKER_ROWS_AROUND_ACTIVE * 2 + 1) };

const LEVEL_SCALES: Record<PickerLevel, number> = {
  active: 1,
  near: 0.72,
  far: 0.52,
  hidden: 0.4
};

const LEVEL_CLASSES: Record<PickerLevel, string> = {
  active: 'text-brand-black opacity-100',
  near: 'text-brand-black/40 opacity-100 hover:text-brand-black/80',
  far: 'text-brand-black/40 opacity-50 hover:opacity-80',
  hidden: 'pointer-events-none text-brand-black/40 opacity-0'
};
