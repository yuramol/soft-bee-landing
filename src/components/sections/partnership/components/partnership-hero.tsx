'use client';

import dynamic from 'next/dynamic';
import { Suspense, useRef, useState, useSyncExternalStore } from 'react';
import { ComponentContainer } from '@/components/layout';
import { Typography } from '@/components/ui/typography';
import PartnerLink from './partner-link';
import PartnershipWorkflow from './partnership-workflow';
import content from '../partnership.json';

const Medusae = dynamic(() => import('@/components/sections/home/hero/components/medusae').then((module) => module.Medusae), {
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

export default function PartnershipHero() {
  const { hero } = content;
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
      className='hero panel relative z-20 overflow-hidden px-4 py-12 md:px-10 md:py-24'
      aria-labelledby='hero-title'
    >
      {canRenderMedusae && (
        <div className='pointer-events-none absolute inset-0 z-0' aria-hidden>
          <Suspense fallback={null}>
            <Medusae eventSource={sectionRef} isHovering={isHovering} className='h-full w-full' radiusScale={0.75} />
          </Suspense>
        </div>
      )}
      <ComponentContainer className='hero-layout relative z-10'>
        <div className='hero-copy'>
          <Typography variant='body3' className='eyebrow' tag='p'>
            {hero.eyebrow}
          </Typography>
          <Typography variant='h1' id='hero-title'>
            {hero.titleLine1}
            <br />
            <Typography variant='h1' tag='span'>
              {hero.titleLine2}
            </Typography>
          </Typography>
          <Typography variant='body2' className='hero-description' tag='p'>
            {hero.description}
          </Typography>
          <div className='hero-actions'>
            <PartnerLink>{hero.actions.primary}</PartnerLink>
            <a className='text-link' href='#how-it-works'>
              {hero.actions.secondary}
            </a>
          </div>
        </div>
        <PartnershipWorkflow />
        <div className='capability-strip relative' aria-label='Engineering capabilities'>
          {hero.capabilities.map((capability, idx) => (
            <Typography key={idx} variant='body3' tag='span'>
              {capability}
            </Typography>
          ))}
        </div>
      </ComponentContainer>
    </section>
  );
}
