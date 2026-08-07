'use client';

import dynamic from 'next/dynamic';
import { Suspense, useRef, useState, useSyncExternalStore } from 'react';
import { ComponentContainer } from '@/components/layout';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { CaseStudyCards, CaseStudyBadge } from './components';

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
  if (typeof window === 'undefined') return false;
  return window.matchMedia(query).matches;
}

interface CaseStudyHeroProps {
  title: string;
  year: string;
  client: string;
  projectType: string;
  tech: string[];
  cards: { title: string; description: string }[];
}

export const CaseStudyHero = ({ title, year, client, projectType, tech, cards }: CaseStudyHeroProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const canRenderMedusae = useSyncExternalStore(
    (onStoreChange) => subscribeMediaQuery(DESKTOP_MEDUSAE_QUERY, onStoreChange),
    () => getMediaQueryMatches(DESKTOP_MEDUSAE_QUERY),
    () => false
  );

  return (
    <section
      ref={sectionRef}
      onPointerEnter={canRenderMedusae ? () => setIsHovering(true) : undefined}
      onPointerLeave={canRenderMedusae ? () => setIsHovering(false) : undefined}
      className={cn(
        'bg-background relative mb-2.5 flex w-full flex-col justify-end overflow-hidden rounded-2xl px-4 pt-30 pb-8 lg:min-h-175 lg:px-10.5 lg:pt-63.75'
      )}
    >
      {canRenderMedusae && (
        <div className='pointer-events-none absolute inset-0 z-0' aria-hidden>
          <Suspense fallback={null}>
            <Medusae eventSource={sectionRef} isHovering={isHovering} className='h-full w-full' />
          </Suspense>
        </div>
      )}

      <ComponentContainer className='relative z-10 flex flex-col'>
        {/* Mobile Header elements */}
        <div className='flex w-full items-center justify-between pb-26.25 lg:hidden'>
          <CaseStudyBadge>{projectType}</CaseStudyBadge>
          <Typography variant='body3' className='text-foreground/50 font-medium'>
            {year}
          </Typography>
        </div>

        <Typography variant='h1' className='pb-6.25 lg:pt-0 lg:pb-41.5'>
          {title}
        </Typography>

        {/* Mobile tech tags */}
        <div className='flex flex-wrap gap-1.5 pb-9.25 lg:hidden'>
          {tech.map((t) => (
            <CaseStudyBadge key={t}>{t}</CaseStudyBadge>
          ))}
        </div>

        {/* Desktop info row */}
        <div className='hidden w-full items-start justify-between pb-16 text-left lg:flex'>
          <div className='flex flex-col gap-2'>
            <Typography variant='body2' className='text-foreground-secondary font-light'>
              Client
            </Typography>
            <Typography variant='body2' className='text-foreground font-semibold'>
              {client}
            </Typography>
          </div>
          <div className='flex flex-col gap-2'>
            <Typography variant='body2' className='text-foreground-secondary font-light'>
              Project type
            </Typography>
            <Typography variant='body2' className='text-foreground font-semibold'>
              {projectType}
            </Typography>
          </div>
          <div className='flex flex-col gap-2'>
            <Typography variant='body2' className='text-foreground-secondary font-light'>
              Tech
            </Typography>
            <Typography variant='body2' className='text-foreground font-semibold'>
              {tech.join(', ')}
            </Typography>
          </div>
          <div className='flex flex-col gap-2 text-right'>
            <Typography variant='body2' className='text-foreground-secondary font-light'>
              Year
            </Typography>
            <Typography variant='body2' className='text-foreground font-semibold'>
              {year}
            </Typography>
          </div>
        </div>
      </ComponentContainer>
      <CaseStudyCards cards={cards} />
    </section>
  );
};
