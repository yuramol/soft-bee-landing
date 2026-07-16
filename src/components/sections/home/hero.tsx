'use client';

import dynamic from 'next/dynamic';
import { Suspense, useRef, useState, useSyncExternalStore } from 'react';

import { Typography } from '@/components/ui/typography';

import { TypingSegment, TypingTitle } from './typing-title';

const Medusae = dynamic(() => import('./medusae').then((module) => module.Medusae), {
  ssr: false,
  loading: () => null
});

const heroTitleSegments: TypingSegment[] = [
  { text: 'Custom', className: 'text-foreground/50', breakAfter: true },
  { text: 'Engineering crafted for ambitious business' }
];

const DESKTOP_MEDUSAE_QUERY = '(hover: hover) and (pointer: fine) and (min-width: 1024px)';

function subscribeMediaQuery(query: string, onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(query);
  mediaQuery.addEventListener('change', onStoreChange);
  return () => mediaQuery.removeEventListener('change', onStoreChange);
}

function getMediaQueryMatches(query: string) {
  return window.matchMedia(query).matches;
}

function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(
    (onStoreChange) => subscribeMediaQuery('(prefers-reduced-motion: reduce)', onStoreChange),
    () => getMediaQueryMatches('(prefers-reduced-motion: reduce)'),
    () => false
  );
  const canRenderMedusae = useSyncExternalStore(
    (onStoreChange) => subscribeMediaQuery(DESKTOP_MEDUSAE_QUERY, onStoreChange),
    () => getMediaQueryMatches(DESKTOP_MEDUSAE_QUERY),
    () => false
  );

  function handlePointerEnter() {
    setIsHovering(true);
  }

  function handlePointerLeave() {
    setIsHovering(false);
  }

  const showMedusae = canRenderMedusae && !prefersReducedMotion;

  return (
    <section
      ref={sectionRef}
      onPointerEnter={showMedusae ? handlePointerEnter : undefined}
      onPointerLeave={showMedusae ? handlePointerLeave : undefined}
      className='bg-background relative flex min-h-[560px] w-full items-end justify-between overflow-hidden rounded-[36px] px-[42px] pb-[108px]'
    >
      {showMedusae && (
        <div className='pointer-events-none absolute inset-0 z-0' aria-hidden>
          <Suspense fallback={null}>
            <Medusae eventSource={sectionRef} isHovering={isHovering} className='h-full w-full' />
          </Suspense>
        </div>
      )}

      <div className='pointer-events-none relative z-10 flex w-full items-end justify-between'>
        <Typography variant='body2' className='max-w-[336px]'>
          Softbee brings together engineers, designers, and analysts to create dependable solutions.
        </Typography>
        <TypingTitle segments={heroTitleSegments} />
      </div>
    </section>
  );
}

export default Hero;
