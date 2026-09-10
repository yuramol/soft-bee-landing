'use client';

import dynamic from 'next/dynamic';
import { ReactNode, Suspense, useRef, useState, useSyncExternalStore } from 'react';

import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

const Medusae = dynamic(() => import('./medusae').then((module) => module.Medusae), {
  ssr: false,
  loading: () => null
});

const DESKTOP_MEDUSAE_QUERY = '(hover: hover) and (pointer: fine) and (min-width: 1024px)';

interface HeroMedusaeBackgroundProps {
  children: ReactNode;
}

function subscribeMediaQuery(query: string, onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(query);
  mediaQuery.addEventListener('change', onStoreChange);
  return () => mediaQuery.removeEventListener('change', onStoreChange);
}

function getMediaQueryMatches(query: string) {
  return window.matchMedia(query).matches;
}

export function HeroMedusaeBackground({ children }: HeroMedusaeBackgroundProps) {
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
        'bg-background relative mb-2.5 flex h-[calc(100svh-20px)] w-full items-end justify-between overflow-hidden rounded-2xl px-5.25 pb-12.75 lg:h-175 lg:max-h-[calc(100vh-20px)] lg:px-10.5',
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

      {children}
    </section>
  );
}
