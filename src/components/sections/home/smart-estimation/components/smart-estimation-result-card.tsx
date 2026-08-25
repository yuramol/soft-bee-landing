'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

import smartEstimationContent from '../content.json';

const topLines = [
  { width: 'w-full', delay: '0ms' },
  { width: 'w-11/12', delay: '150ms' },
  { width: 'w-4/5', delay: '300ms' }
];

const col1Lines = [
  { width: 'w-full', delay: '450ms' },
  { width: 'w-11/12', delay: '600ms' },
  { width: 'w-4/5', delay: '750ms' },
  { width: 'w-[85%]', delay: '900ms' },
  { width: 'w-[90%]', delay: '1050ms' },
  { width: 'w-3/4', delay: '1200ms' }
];

const col2Lines = [
  { width: 'w-11/12', delay: '1350ms' },
  { width: 'w-full', delay: '1500ms' },
  { width: 'w-4/5', delay: '1650ms' },
  { width: 'w-[85%]', delay: '1800ms' },
  { width: 'w-[95%]', delay: '1950ms' },
  { width: 'w-3/4', delay: '2100ms' }
];

const SmartEstimationSkeleton = () => {
  return (
    <div className='relative z-10 flex w-full flex-col'>
      <div className='mb-10 flex w-full flex-col gap-4.25 md:mb-26'>
        {topLines.map((line, i) => (
          <div
            key={i}
            className={cn('bg-muted h-6 animate-[solidPulse_1.5s_ease-in-out_infinite]', line.width)}
            style={{ animationDelay: line.delay }}
          />
        ))}
      </div>
      <div className='flex w-full gap-10.75'>
        <div className='flex flex-1 flex-col gap-4.25'>
          {col1Lines.map((line, i) => (
            <div
              key={i}
              className={cn('bg-muted h-6 animate-[solidPulse_1.5s_ease-in-out_infinite]', line.width)}
              style={{ animationDelay: line.delay }}
            />
          ))}
        </div>
        <div className='flex flex-1 flex-col gap-4.25'>
          {col2Lines.map((line, i) => (
            <div
              key={i}
              className={cn('bg-muted h-6 animate-[solidPulse_1.5s_ease-in-out_infinite]', line.width)}
              style={{ animationDelay: line.delay }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const SmartEstimationResultCard = ({ isSuccess, onDownload }: { isSuccess?: boolean; onDownload?: () => void }) => {
  const { result } = smartEstimationContent;

  return (
    <div className='relative z-40 min-h-screen w-201.5 max-w-[calc(100vw-32px)] shrink-0 animate-[slideUp_0.5s_ease-out_forwards]'>
      <div className='absolute -inset-2 -z-10 rounded-t-[45px] bg-linear-to-r from-[#C3FF00] to-[#00A2BB] opacity-60 blur-3xl' />

      <div className='bg-gradient-border shadow-smart-result relative h-full w-full overflow-hidden rounded-t-[45px] rounded-b-none border-2 border-b-0 border-transparent'>
        <div className='relative flex w-full flex-col p-10 md:px-16 md:pt-15.25 md:pb-10'>
          <div className='-md:left-23.75 pointer-events-none absolute top-[-10%] left-[-10%] z-20 opacity-[0.03] md:-top-15.25'>
            <Icon icon='LogoMark' className='h-57.5 w-48.5 md:h-115 md:w-97' />
          </div>

          {isSuccess && (
            <div className='pointer-events-none absolute top-10 left-10 z-10 flex flex-col text-left text-black md:top-15 md:left-16'>
              <div className='text-[24px] leading-normal font-medium md:text-[32px]'>Estimate: 20-25 hours</div>
              <div className='mt-6 text-[16px] leading-normal md:text-[20px]'>Price: $350,000 - $450,000 approximately for the work</div>
            </div>
          )}

          {isSuccess && (
            <div className='absolute top-29.25 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2'>
              <Button onClick={onDownload} className='shadow-smart-download w-42.75'>
                {result.downloadLabel}
              </Button>
            </div>
          )}

          {!isSuccess && <SmartEstimationSkeleton />}
        </div>
      </div>
    </div>
  );
};

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
