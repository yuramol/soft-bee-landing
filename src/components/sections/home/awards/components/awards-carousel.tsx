'use client';

import { TransitionEvent, useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';

import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

import { AwardItemData, AWARDS_ITEMS } from '../data';
import { AwardsItem } from './awards-item';

const AUTO_SCROLL_INTERVAL_MS = 5000;
const SLIDE_TRANSITION_S = 0.6;
const NEXT_CARD_PEEK_FALLBACK_PX = 200;
const DESKTOP_QUERY = '(min-width: 1536px)';

interface AwardsCarouselProps {
  className?: string;
}

export function AwardsCarousel({ className }: AwardsCarouselProps) {
  const items = AWARDS_ITEMS;

  const isDesktop = useSyncExternalStore(
    (onStoreChange) => subscribeMediaQuery(DESKTOP_QUERY, onStoreChange),
    () => getMediaQueryMatches(DESKTOP_QUERY),
    () => false
  );

  if (items.length === 0) {
    return null;
  }

  if (items.length === 1) {
    return <div className={cn('w-full max-w-150', className)}>{renderAwardItem(items[0])}</div>;
  }

  return (
    <>
      <StaticList items={items} className={className} />
      <CarouselTrack items={items} isActive={isDesktop} className={className} />
    </>
  );
}

interface StaticListProps {
  items: AwardItemData[];
  className?: string;
}

function StaticList({ items, className }: StaticListProps) {
  return (
    <div className={cn('z-100 flex w-full flex-col items-center gap-3 lg:gap-6 2xl:hidden 2xl:max-w-150', className)}>
      {items.map((item) => (
        <div key={item.id}>{renderAwardItem(item)}</div>
      ))}
    </div>
  );
}

interface CarouselTrackProps {
  items: AwardItemData[];
  isActive: boolean;
  className?: string;
}

function CarouselTrack({ items, isActive, className }: CarouselTrackProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [slideOffset, setSlideOffset] = useState(0);
  const [viewportHeight, setViewportHeight] = useState<number | undefined>(undefined);
  const firstCardRef = useRef<HTMLDivElement>(null);
  const secondCardRef = useRef<HTMLDivElement>(null);
  const slideOffsetRef = useRef(0);
  const isSlidingRef = useRef(false);

  const currentIndex = activeIndex;
  const nextIndex = (activeIndex + 1) % items.length;
  const followingIndex = (activeIndex + 2) % items.length;

  const updateMeasurements = useCallback(() => {
    const firstCard = firstCardRef.current;
    const secondCard = secondCardRef.current;

    if (!firstCard || !secondCard) {
      return;
    }

    const offset = secondCard.offsetTop - firstCard.offsetTop;

    slideOffsetRef.current = offset;
    setSlideOffset(offset);
    setViewportHeight(offset + NEXT_CARD_PEEK_FALLBACK_PX);
  }, []);

  useLayoutEffect(() => {
    isSlidingRef.current = isSliding;
  }, [isSliding]);

  useLayoutEffect(() => {
    if (!isActive) {
      return;
    }

    const firstCard = firstCardRef.current;
    const secondCard = secondCardRef.current;

    if (!firstCard || !secondCard) {
      return;
    }

    updateMeasurements();

    const observer = new ResizeObserver(updateMeasurements);

    observer.observe(firstCard);
    observer.observe(secondCard);

    return () => observer.disconnect();
  }, [isActive, updateMeasurements, currentIndex, nextIndex, followingIndex]);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const timer = window.setInterval(() => {
      if (slideOffsetRef.current <= 0 || isSlidingRef.current) {
        return;
      }

      setIsSliding(true);
    }, AUTO_SCROLL_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [isActive]);

  const handleSlideTransitionEnd = useCallback(
    (event: TransitionEvent<HTMLDivElement>) => {
      if (event.propertyName !== 'transform' || event.target !== event.currentTarget) {
        return;
      }

      if (!isSlidingRef.current) {
        return;
      }

      isSlidingRef.current = false;
      setActiveIndex((previousIndex) => (previousIndex + 1) % items.length);
      setIsSliding(false);
    },
    [items.length]
  );

  return (
    <div
      className={cn(
        'relative z-10 mt-60 hidden w-full max-w-150 overflow-hidden 2xl:absolute 2xl:top-1/2 2xl:right-11.25 2xl:block 2xl:w-auto 2xl:-translate-y-1/2',
        className
      )}
      style={viewportHeight ? { height: viewportHeight } : undefined}
    >
      <div
        className='flex flex-col gap-17'
        style={{
          transform: isSliding ? `translateY(${-slideOffset}px)` : 'translateY(0px)',
          transition: isSliding ? `transform ${SLIDE_TRANSITION_S}s ease-in-out` : 'none',
          willChange: isSliding ? 'transform' : 'auto'
        }}
        onTransitionEnd={handleSlideTransitionEnd}
      >
        <div ref={firstCardRef}>{renderAwardItem(items[currentIndex])}</div>
        <div ref={secondCardRef}>{renderAwardItem(items[nextIndex])}</div>
        <div aria-hidden='true'>{renderAwardItem(items[followingIndex])}</div>
      </div>
    </div>
  );
}

function renderAwardItem(item: AwardItemData) {
  return (
    <AwardsItem
      logo={<Icon icon={item.logoIcon} className={item.logoClassName} />}
      description={item.description}
      profileUrl={item.profileUrl}
    />
  );
}

function subscribeMediaQuery(query: string, onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(query);
  mediaQuery.addEventListener('change', onStoreChange);
  return () => mediaQuery.removeEventListener('change', onStoreChange);
}

function getMediaQueryMatches(query: string) {
  return window.matchMedia(query).matches;
}
