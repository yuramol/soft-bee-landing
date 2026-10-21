'use client';

import { useEffect, useRef, useState } from 'react';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import content from '../content.json';

interface ArticleSidebarProps {
  headings: { id: string; title: string }[];
}

export function ArticleSidebar({ headings }: ArticleSidebarProps) {
  const [activeId, setActiveId] = useState<string>(() => headings[0]?.id ?? '');
  const isClickScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  function unlockScroll() {
    isClickScrollingRef.current = false;
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = null;
    }
  }

  useEffect(() => {
    if (headings.length === 0) return;

    let rafId: number | null = null;

    function updateActiveHeading() {
      const threshold = 180;
      let currentId = headings[0]?.id ?? '';

      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (!element) continue;
        const rect = element.getBoundingClientRect();
        if (rect.top <= threshold) {
          currentId = heading.id;
        } else {
          break;
        }
      }

      setActiveId(currentId);
    }

    function handleWindowScroll() {
      if (isClickScrollingRef.current) return;

      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        updateActiveHeading();
      });
    }

    function handleManualScrollInterrupt() {
      if (isClickScrollingRef.current) {
        unlockScroll();
        updateActiveHeading();
      }
    }

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    window.addEventListener('wheel', handleManualScrollInterrupt, { passive: true });
    window.addEventListener('touchmove', handleManualScrollInterrupt, { passive: true });
    updateActiveHeading();

    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
      window.removeEventListener('wheel', handleManualScrollInterrupt);
      window.removeEventListener('touchmove', handleManualScrollInterrupt);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [headings]);

  function handleHeadingClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    const id = e.currentTarget.getAttribute('data-id');
    if (!id) return;

    isClickScrollingRef.current = true;
    setActiveId(id);

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Safety timeout to unlock if smooth scroll ends or doesn't fire scrollend
    scrollTimeoutRef.current = setTimeout(() => {
      unlockScroll();
    }, 1000);

    function handleScrollEnd() {
      unlockScroll();
      window.removeEventListener('scrollend', handleScrollEnd);
    }

    window.addEventListener('scrollend', handleScrollEnd, { once: true });

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <div className='sticky top-10 flex flex-col gap-2.25 lg:gap-3.5'>
      <div className='lg:hidden'>
        <Typography variant='h3' className='text-brand-black font-semibold'>
          {content.sidebar.title}
        </Typography>
      </div>
      {headings.map((heading) => {
        const isActive = heading.id === activeId;

        return (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            data-id={heading.id}
            onClick={handleHeadingClick}
            aria-current={isActive ? 'true' : undefined}
            className={cn(
              'transition-colors duration-200',
              isActive ? 'text-foreground' : 'text-foreground-secondary hover:text-foreground'
            )}
          >
            <Typography variant='body2' className={isActive ? 'font-semibold' : 'font-medium'}>
              {heading.title}
            </Typography>
          </a>
        );
      })}
    </div>
  );
}
