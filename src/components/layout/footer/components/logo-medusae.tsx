'use client';

import dynamic from 'next/dynamic';
import { Suspense, useRef, useState, useSyncExternalStore } from 'react';

import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

const FooterMedusae = dynamic(() => import('./footer-medusae').then((module) => module.FooterMedusae), {
  ssr: false,
  loading: () => null
});

const DESKTOP_MEDUSAE_QUERY = '(hover: hover) and (pointer: fine) and (min-width: 1024px)';

function subscribeMediaQuery(query: string, onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(query);
  mediaQuery.addEventListener('change', onStoreChange);
  return () => mediaQuery.removeEventListener('change', onStoreChange);
}

function getMediaQueryMatches(query: string) {
  return window.matchMedia(query).matches;
}

interface LogoMedusaeProps {
  className?: string;
}

export function LogoMedusae({ className }: LogoMedusaeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
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
    <div
      ref={containerRef}
      onPointerEnter={canRenderMedusae ? handlePointerEnter : undefined}
      onPointerLeave={canRenderMedusae ? handlePointerLeave : undefined}
      className={cn('relative mb-5 w-full overflow-hidden', canRenderMedusae && 'aspect-165/72', className)}
      aria-label='Soft Bee'
      role='img'
    >
      {canRenderMedusae ? (
        <div className='pointer-events-none absolute inset-0 z-0' aria-hidden>
          <Suspense fallback={null}>
            <FooterMedusae eventSource={containerRef} isHovering={isHovering} className='h-full w-full' />
          </Suspense>
        </div>
      ) : (
        <div className='flex aspect-165/72 items-center justify-center'>
          <Icon icon='Logo' className='text-foreground h-auto w-full lg:hidden' />
        </div>
      )}
    </div>
  );
}
