'use client';

import dynamic from 'next/dynamic';
import { Suspense, useRef, useState, useSyncExternalStore } from 'react';

import { ComponentContainer } from '@/components/layout';
import { Icon } from '@/components/ui/icon';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

import { TypingSegment, TypingTitle } from './components';

const Medusae = dynamic(() => import('./components/medusae').then((module) => module.Medusae), {
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

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isHovering, setIsHovering] = useState(false);
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

  return (
    <section
      ref={sectionRef}
      onPointerEnter={canRenderMedusae ? handlePointerEnter : undefined}
      onPointerLeave={canRenderMedusae ? handlePointerLeave : undefined}
      className={cn(
        'bg-background relative mb-2.5 flex h-175 max-h-[calc(100vh-20px)] w-full items-end justify-between overflow-hidden rounded-2xl px-5.25 pb-[51px] lg:px-10.5',
        'lg:min-h-140 lg:pb-27'
      )}
    >
      {canRenderMedusae && (
        <div className='pointer-events-none absolute inset-0 z-0' aria-hidden>
          <Suspense fallback={null}>
            <Medusae eventSource={sectionRef} isHovering={isHovering} className='h-full w-full' />
          </Suspense>
        </div>
      )}

      <div className='pointer-events-none absolute inset-0 z-0 overflow-hidden lg:hidden' aria-hidden>
        <Icon icon='LogoShort' width={196} height={297} className='absolute right-0 bottom-40' />
      </div>

      <ComponentContainer
        className={cn(
          'pointer-events-none relative z-10 flex w-full flex-col-reverse gap-6.75',
          'xl:flex-row xl:items-end xl:justify-between'
        )}
      >
        <Typography variant='body2' className='max-w-84'>
          Softbee brings together engineers, designers, and analysts to create dependable solutions.
        </Typography>
        <TypingTitle segments={heroTitleSegments} />
      </ComponentContainer>
    </section>
  );
}
