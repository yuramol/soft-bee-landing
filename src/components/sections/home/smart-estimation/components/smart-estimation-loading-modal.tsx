'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

import smartEstimationContent from '../content.json';
import { SmartEstimationSkeleton } from './smart-estimation-skeleton';

export function SmartEstimationLoadingModal() {
  const { result } = smartEstimationContent;
  const [orderedPhrases] = useState(() => shuffleStrings(result.assessingLabels));
  const [playbackKey, setPlaybackKey] = useState(0);
  const [typedCount, setTypedCount] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  const currentPhrase = orderedPhrases.length === 0 ? '' : (orderedPhrases[playbackKey % orderedPhrases.length] ?? '');
  const visibleCount = prefersReducedMotion ? currentPhrase.length : typedCount;
  const visibleText = currentPhrase.slice(0, visibleCount);
  const showCaret = !prefersReducedMotion && currentPhrase.length > 0;

  useEffect(() => {
    if (orderedPhrases.length === 0) return undefined;

    function advancePhrase() {
      setTypedCount(0);
      setPlaybackKey((currentKey) => currentKey + 1);
    }

    if (prefersReducedMotion) {
      const holdTimeoutId = setTimeout(advancePhrase, PHRASE_HOLD_MS);
      return () => clearTimeout(holdTimeoutId);
    }

    let frameId: number | null = null;
    let holdTimeoutId: ReturnType<typeof setTimeout> | undefined;
    let startTime: number | null = null;
    let lastCount = 0;

    function tick(now: number) {
      if (startTime === null) {
        startTime = now;
      }

      const elapsed = now - startTime - TYPE_START_DELAY_MS;

      if (elapsed >= 0) {
        const nextCount = Math.min(currentPhrase.length, Math.floor(elapsed / TYPE_SPEED_MS) + 1);

        if (nextCount !== lastCount) {
          lastCount = nextCount;
          setTypedCount(nextCount);
        }
      }

      if (lastCount < currentPhrase.length) {
        frameId = requestAnimationFrame(tick);
        return;
      }

      holdTimeoutId = setTimeout(advancePhrase, PHRASE_HOLD_MS);
    }

    frameId = requestAnimationFrame(tick);

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      if (holdTimeoutId !== undefined) clearTimeout(holdTimeoutId);
    };
  }, [currentPhrase, orderedPhrases.length, playbackKey, prefersReducedMotion]);

  return (
    <>
      <div className='animate-in fade-in-0 fixed inset-0 z-20 bg-[#0000003d] duration-200' />
      <div className='pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4' role='status' aria-live='polite'>
        <div className='animate-in fade-in-0 zoom-in-95 relative w-201.5 max-w-[calc(100vw-32px)] duration-200'>
          <div className='absolute -inset-2 -z-10 rounded-[45px] bg-linear-to-r from-[#C3FF00] to-[#00A2BB] opacity-60 blur-3xl' />

          <div className='bg-gradient-border shadow-smart-result relative overflow-hidden rounded-[45px] border-2 border-transparent'>
            <div className='relative flex w-full flex-col p-10 md:px-16 md:pt-15.25 md:pb-10'>
              <div className='-md:left-23.75 pointer-events-none absolute top-[-10%] left-[-10%] z-20 opacity-[0.03] md:-top-15.25'>
                <Icon icon='LogoMark' className='h-57.5 w-48.5 md:h-115 md:w-97' />
              </div>

              <SmartEstimationSkeleton />

              <div className='absolute inset-0 z-50 flex items-center justify-center'>
                <div className='shadow-smart-assessing flex min-h-15 max-w-[calc(100%-1.5rem)] items-center justify-center gap-2.5 rounded-[200px] bg-[#C3FF00] px-5 py-3 font-medium text-black md:px-6'>
                  <span
                    key={playbackKey}
                    className={cn(
                      'inline-flex origin-center',
                      !prefersReducedMotion && 'animate-[spin_0.7s_ease-in-out] motion-reduce:animate-none'
                    )}
                  >
                    <Icon icon='LogoMark' className='shrink-0' width={24} height={28} />
                  </span>
                  <span className='relative inline-block text-left text-[14px] leading-5 md:text-[16px] md:leading-snug'>
                    <span className='sr-only'>{currentPhrase}</span>
                    <span className='invisible' aria-hidden>
                      {currentPhrase}
                      <span className='type-caret' />
                    </span>
                    <span aria-hidden className='absolute inset-0'>
                      {visibleText}
                      {showCaret && <span className='type-caret bg-black' />}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function shuffleStrings(items: string[]): string[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const currentItem = shuffled[index];
    const swapItem = shuffled[swapIndex];

    if (currentItem === undefined || swapItem === undefined) continue;

    shuffled[index] = swapItem;
    shuffled[swapIndex] = currentItem;
  }

  return shuffled;
}

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, getReducedMotionServerSnapshot);
}

function subscribeReducedMotion(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.addEventListener('change', onStoreChange);
  return () => mediaQuery.removeEventListener('change', onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

const TYPE_SPEED_MS = 32;
const TYPE_START_DELAY_MS = 120;
const PHRASE_HOLD_MS = 1800;
