'use client';

import { ReactNode, useEffect, useRef, useSyncExternalStore } from 'react';

import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

function getTotalChars(segments: TypingSegment[]): number {
  return segments.reduce((sum, segment) => sum + segment.text.length, 0);
}

export interface TypingSegment {
  text: string;
  className?: string;
  breakAfter?: boolean;
}

interface TypingTitleProps {
  segments: TypingSegment[];
  className?: string;
  speedMs?: number;
  startDelayMs?: number;
}

export function TypingTitle({ segments, className, speedMs = 42, startDelayMs = 200 }: TypingTitleProps) {
  const visibleRef = useRef<HTMLSpanElement>(null);
  const totalChars = getTotalChars(segments);
  const prefersReducedMotion = useSyncExternalStore(
    (onStoreChange) => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      mediaQuery.addEventListener('change', onStoreChange);
      return () => mediaQuery.removeEventListener('change', onStoreChange);
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false
  );

  useEffect(() => {
    const container = visibleRef.current;

    if (!container) {
      return;
    }

    const visible = container;

    if (prefersReducedMotion) {
      paintTypedTitle(visible, segments, totalChars);
      return;
    }

    let startTime: number | null = null;
    let lastCount = -1;
    let frameId = 0;

    function tick(now: number) {
      if (startTime === null) {
        startTime = now;
      }

      const elapsed = now - startTime - startDelayMs;
      const nextCount = elapsed >= 0 ? Math.min(totalChars, Math.floor(elapsed / speedMs) + 1) : 0;

      if (nextCount !== lastCount) {
        lastCount = nextCount;
        paintTypedTitle(visible, segments, nextCount);
      }

      if (lastCount < totalChars) {
        frameId = requestAnimationFrame(tick);
      }
    }

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [prefersReducedMotion, segments, totalChars, speedMs, startDelayMs]);

  return (
    <Typography variant='h1' className={cn('relative w-fit max-w-[750px] leading-[110%]', `2xl:max-w-[905px]`, className)}>
      {/* Full text stays in the layout (and accessibility tree) to reserve space and avoid layout shift. */}
      <span className='opacity-0'>{renderSegments(segments)}</span>
      <span ref={visibleRef} aria-hidden className='absolute inset-0' />
    </Typography>
  );
}

function paintTypedTitle(container: HTMLSpanElement, segments: TypingSegment[], visibleCount: number) {
  const fragment = document.createDocumentFragment();
  let remaining = visibleCount;

  segments.forEach((segment) => {
    const shown = Math.max(0, Math.min(segment.text.length, remaining));

    if (shown > 0) {
      const span = document.createElement('span');
      if (segment.className) {
        span.className = segment.className;
      }
      span.textContent = segment.text.slice(0, shown);
      fragment.append(span);
    }

    const fullyShown = remaining >= segment.text.length;
    remaining -= segment.text.length;

    if (segment.breakAfter && fullyShown) {
      fragment.append(document.createElement('br'));
    }
  });

  if (visibleCount < getTotalChars(segments)) {
    const caret = document.createElement('span');
    caret.className = 'type-caret';
    fragment.append(caret);
  }

  container.replaceChildren(fragment);
}

function renderSegments(segments: TypingSegment[], visibleCount?: number): ReactNode[] {
  const isFull = visibleCount === undefined;
  let remaining = visibleCount ?? 0;
  const nodes: ReactNode[] = [];

  segments.forEach((segment, index) => {
    const shown = isFull ? segment.text.length : Math.max(0, Math.min(segment.text.length, remaining));

    if (shown > 0) {
      nodes.push(
        <span key={`seg-${index}`} className={segment.className}>
          {segment.text.slice(0, shown)}
        </span>
      );
    }

    const fullyShown = isFull || remaining >= segment.text.length;
    remaining -= segment.text.length;

    if (segment.breakAfter && fullyShown) {
      nodes.push(<br key={`br-${index}`} />);
    }
  });

  return nodes;
}
