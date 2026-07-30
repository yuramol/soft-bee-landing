'use client';

import { useEffect, useRef } from 'react';

import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

import { TOOLS } from './data';
import { ToolItem } from './tool-item';

const WAVE_STAGGER_S = 0.22;
const AUTO_SCROLL_SPEED_PX_PER_S = 48;

export function ToolsWave() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const containerElement = containerRef.current;
    const trackElement = trackRef.current;
    if (!containerElement || !trackElement) return;

    const container = containerElement;
    const track = trackElement;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotionQuery.matches) return;

    let animationFrameId = 0;
    let previousTimestamp: number | null = null;
    let offsetX = 0;
    let isScrollComplete = false;
    let hasStarted = false;

    function setOffset(nextOffsetX: number) {
      offsetX = nextOffsetX;
      track.style.transform = `translate3d(${-offsetX}px, 0, 0)`;
    }

    function stopScroll() {
      isScrollComplete = true;
      cancelAnimationFrame(animationFrameId);
    }

    function step(timestamp: number) {
      if (isScrollComplete) return;

      if (previousTimestamp === null) {
        previousTimestamp = timestamp;
      }

      const elapsedMs = timestamp - previousTimestamp;
      previousTimestamp = timestamp;

      const maxOffsetX = Math.max(0, track.scrollWidth - container.clientWidth);

      if (maxOffsetX <= 0) {
        stopScroll();
        return;
      }

      const distance = (AUTO_SCROLL_SPEED_PX_PER_S * elapsedMs) / 1000;
      const nextOffsetX = offsetX + distance;

      if (nextOffsetX >= maxOffsetX) {
        setOffset(maxOffsetX);
        stopScroll();
        return;
      }

      setOffset(nextOffsetX);
      animationFrameId = requestAnimationFrame(step);
    }

    function startScroll() {
      if (hasStarted || isScrollComplete) return;
      hasStarted = true;
      animationFrameId = requestAnimationFrame(step);
    }

    // Defer auto-scroll until visible so continuous motion doesn't
    // starve R3F's useMeasure debounce on first paint of the hero canvas.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          startScroll();
          observer.disconnect();
        }
      },
      { root: null, threshold: 0.15 }
    );

    observer.observe(container);

    return function cleanup() {
      observer.disconnect();
      stopScroll();
    };
  }, []);

  return (
    <div ref={containerRef} className='w-full overflow-x-clip'>
      <ul
        ref={trackRef}
        className={cn(
          'mx-auto flex w-max items-center gap-4 px-4 pt-16 pb-36 will-change-transform',
          'sm:gap-5 sm:pt-20 lg:gap-6 lg:pt-24 lg:pb-56'
        )}
      >
        {TOOLS.map(function renderTool(tool, index) {
          return (
            <li
              key={`${tool.name}-${index}`}
              className='tools-wave-item relative z-0 will-change-transform hover:z-20'
              style={{ animationDelay: `${-index * WAVE_STAGGER_S}s` }}
            >
              <ToolItem
                icon={<Icon icon={tool.icon} size={85} />}
                name={tool.name}
                description={tool.description}
                invertOnHover={tool.invertOnHover}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
