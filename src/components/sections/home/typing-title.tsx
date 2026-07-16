'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

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
  const totalChars = getTotalChars(segments);
  const [visibleCount, setVisibleCount] = useState(0);
  const frameRef = useRef<number | null>(null);
  const isTyping = visibleCount < totalChars;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setVisibleCount(totalChars);
      return;
    }

    let startTime: number | null = null;
    let lastCount = 0;

    function tick(now: number) {
      if (startTime === null) {
        startTime = now;
      }

      const elapsed = now - startTime - startDelayMs;

      if (elapsed >= 0) {
        const nextCount = Math.min(totalChars, Math.floor(elapsed / speedMs) + 1);

        if (nextCount !== lastCount) {
          lastCount = nextCount;
          setVisibleCount(nextCount);
        }
      }

      if (lastCount < totalChars) {
        frameRef.current = requestAnimationFrame(tick);
      }
    }

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [totalChars, speedMs, startDelayMs]);

  return (
    <h1 className={cn('relative w-fit max-w-[905px] text-70 leading-[110%]', className)}>
      {/* Full text stays in the layout (and accessibility tree) to reserve space and avoid layout shift. */}
      <span className="opacity-0">{renderSegments(segments)}</span>
      <span aria-hidden className="absolute inset-0">
        {renderSegments(segments, visibleCount)}
        {isTyping && <span className="type-caret" />}
      </span>
    </h1>
  );
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