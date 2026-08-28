'use client';

import dynamic from 'next/dynamic';
import { Suspense, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { ComponentContainer } from '@/components/layout';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { CustomBreadcrumbs } from '@/components/ui/custom-breadcrumbs';
import { TopicBadge } from '@/components/ui/topic-badge';
import { ROUTES } from '@/constants';
import articleHeroContent from './content.json';

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

interface ArticleHeroProps {
  topic: string;
  title: string;
  authorName: string;
  authorRole: string;
  authorImage: string;
  readTime: string;
  date: string;
}

export function ArticleHero({ topic, title, authorName, authorRole, authorImage, readTime, date }: ArticleHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const canRenderMedusae = useSyncExternalStore(
    (onStoreChange) => subscribeMediaQuery(DESKTOP_MEDUSAE_QUERY, onStoreChange),
    () => getMediaQueryMatches(DESKTOP_MEDUSAE_QUERY),
    () => false
  );

  const handlePointerEnter = () => setIsHovering(true);
  const handlePointerLeave = () => setIsHovering(false);

  return (
    <section
      ref={sectionRef}
      onPointerEnter={canRenderMedusae ? handlePointerEnter : undefined}
      onPointerLeave={canRenderMedusae ? handlePointerLeave : undefined}
      className={cn(
        'bg-background relative mb-2.5 flex w-full flex-col justify-end overflow-hidden rounded-2xl px-4 pt-25 pb-11.5 lg:min-h-175 lg:px-10.5 lg:pt-35'
      )}
    >
      {canRenderMedusae && (
        <div className='pointer-events-none absolute inset-0 z-0' aria-hidden>
          <Suspense fallback={null}>
            <Medusae eventSource={sectionRef} isHovering={isHovering} className='h-full w-full' />
          </Suspense>
        </div>
      )}

      <ComponentContainer className='relative z-10 flex h-full flex-col'>
        <div className='mb-8 flex w-full flex-col pb-6.25 lg:mb-22 lg:pb-0'>
          <CustomBreadcrumbs
            items={[
              { label: articleHeroContent.breadcrumbs.home, href: ROUTES.HOME },
              { label: articleHeroContent.breadcrumbs.insights, href: ROUTES.INSIGHTS },
              { label: topic, isActive: true }
            ]}
          />
        </div>

        <div className='mb-16.25 flex flex-col gap-7 lg:mb-41.5 lg:flex-row lg:items-start lg:justify-between'>
          <Typography variant='h1' className='max-w-215.25'>
            {title}
          </Typography>

          <div className='flex items-center gap-5'>
            <Image
              src={authorImage}
              width={63}
              height={63}
              className='h-15.75 w-15.75 shrink-0 rounded-full object-cover'
              alt={authorName}
            />
            <div className='flex flex-col gap-0.5 whitespace-nowrap'>
              <Typography variant='body2' className='text-foreground font-semibold'>
                {authorName}
              </Typography>
              <Typography variant='body2' className='text-foreground/50'>
                {authorRole}
              </Typography>
            </div>
          </div>
        </div>

        {/* Mobile Info Row */}
        <div className='flex w-full items-center justify-between lg:hidden'>
          <TopicBadge>{topic}</TopicBadge>
          <Typography variant='body3' className='text-foreground/50 font-medium'>
            {readTime}
          </Typography>
        </div>

        {/* Desktop info row */}
        <div className='hidden w-full items-start justify-between lg:flex'>
          <div className='flex flex-col gap-2'>
            <Typography variant='body2' className='text-foreground/50'>
              {articleHeroContent.topic}
            </Typography>
            <Typography variant='body2' className='text-foreground font-medium'>
              {topic}
            </Typography>
          </div>
          <div className='flex flex-col gap-2'>
            <Typography variant='body2' className='text-foreground/50'>
              {articleHeroContent.readTime}
            </Typography>
            <Typography variant='body2' className='text-foreground font-medium'>
              {readTime}
            </Typography>
          </div>
          <div className='flex flex-col gap-2'>
            <Typography variant='body2' className='text-foreground/50'>
              {articleHeroContent.date}
            </Typography>
            <Typography variant='body2' className='text-foreground font-medium'>
              {date}
            </Typography>
          </div>
        </div>
      </ComponentContainer>
    </section>
  );
}
