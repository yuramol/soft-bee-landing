'use client';

import { animate, motion, useInView, useMotionValue, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Icon, IconName } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

import toolsContent from '../content.json';
import { ToolItem } from './tool-item';

interface Tool {
  name: string;
  description: string;
  icon: IconName;
  invertOnHover?: boolean;
}

const TOOLS = toolsContent.tools as Tool[];

const WAVE_STAGGER_S = 0.22;
const AUTO_SCROLL_SPEED_PX_PER_S = 48;

const trackWrapperClassName = cn(
  'flex w-max will-change-transform',
  'gap-4 pt-16 pb-36 px-4',
  'sm:gap-5 sm:pt-20 lg:gap-6 lg:pt-24 lg:pb-56',
  'xl:pt-14 xl:pb-20'
);

const trackClassName = cn('flex w-max items-center gap-4', 'sm:gap-5 lg:gap-6');

export function ToolsWave() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.15 });
  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const controlsRef = useRef<ReturnType<typeof animate> | null>(null);
  const loopWidthRef = useRef(0);
  const [openToolsCount, setOpenToolsCount] = useState(0);
  const isToolOpenRef = useRef(false);

  const handleToolOpenChange = useCallback(function handleToolOpenChange(isOpen: boolean) {
    setOpenToolsCount(function updateOpenToolsCount(count) {
      return Math.max(0, count + (isOpen ? 1 : -1));
    });
  }, []);

  useEffect(
    function pauseMarqueeOnToolOpen() {
      isToolOpenRef.current = openToolsCount > 0;

      if (openToolsCount > 0) {
        controlsRef.current?.pause();
      } else {
        controlsRef.current?.play();
      }
    },
    [openToolsCount]
  );

  useEffect(
    function runMarquee() {
      function getLoopWidth() {
        const first = trackRef.current?.children[0];
        const second = trackRef.current?.children[1];

        if (!(first instanceof HTMLElement) || !(second instanceof HTMLElement)) {
          return 0;
        }

        return second.offsetLeft - first.offsetLeft;
      }

      function stopMarquee() {
        controlsRef.current?.stop();
        controlsRef.current = null;
        x.set(0);
      }

      function startMarquee() {
        const loopWidth = getLoopWidth();
        if (loopWidth <= 0) {
          return;
        }

        loopWidthRef.current = loopWidth;
        controlsRef.current?.stop();
        x.set(0);

        controlsRef.current = animate(x, -loopWidth, {
          duration: loopWidth / AUTO_SCROLL_SPEED_PX_PER_S,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'loop'
        });

        if (isToolOpenRef.current) {
          controlsRef.current.pause();
        }
      }

      if (!isInView || prefersReducedMotion) {
        stopMarquee();
        return;
      }

      startMarquee();

      const trackElement = trackRef.current;
      if (!trackElement) {
        return stopMarquee;
      }

      let debounceId = 0;
      const resizeObserver = new ResizeObserver(function handleResize() {
        window.clearTimeout(debounceId);
        debounceId = window.setTimeout(function restartIfResized() {
          const nextLoopWidth = getLoopWidth();
          if (nextLoopWidth <= 0 || Math.abs(nextLoopWidth - loopWidthRef.current) <= 2) {
            return;
          }

          startMarquee();
        }, 250);
      });

      Array.from(trackElement.children).forEach(function observeChild(child) {
        resizeObserver.observe(child);
      });

      return function cleanup() {
        window.clearTimeout(debounceId);
        resizeObserver.disconnect();
        stopMarquee();
      };
    },
    [isInView, prefersReducedMotion, x]
  );

  return (
    <div ref={containerRef} className='w-full overflow-x-clip'>
      <motion.div ref={trackRef} style={{ x }} className={cn(trackWrapperClassName, openToolsCount > 0 && 'tools-wave-paused')}>
        {renderToolSet(0, handleToolOpenChange)}
        {renderToolSet(TOOLS.length, handleToolOpenChange, true)}
      </motion.div>
    </div>
  );
}

function renderToolSet(copyOffset: number, onToolOpenChange: (isOpen: boolean) => void, ariaHidden = false) {
  return (
    <ul aria-hidden={ariaHidden || undefined} className={trackClassName}>
      {TOOLS.map(function renderTool(tool, index) {
        const itemIndex = copyOffset + index;

        return (
          <li
            key={`${tool.name}-${itemIndex}`}
            className='tools-wave-item relative z-0 will-change-transform hover:z-20'
            style={{ animationDelay: `${-itemIndex * WAVE_STAGGER_S}s` }}
          >
            <ToolItem
              icon={<Icon icon={tool.icon} size={85} />}
              name={tool.name}
              description={tool.description}
              invertOnHover={tool.invertOnHover}
              onOpenChange={onToolOpenChange}
            />
          </li>
        );
      })}
    </ul>
  );
}
