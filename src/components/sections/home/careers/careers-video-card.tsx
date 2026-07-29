'use client';

import { PointerEvent, useState, useSyncExternalStore } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Icon } from '@/components/ui/icon';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface PointerPosition {
  x: number;
  y: number;
}

const DESKTOP_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

function subscribeMediaQuery(query: string, onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(query);
  mediaQuery.addEventListener('change', onStoreChange);
  return () => mediaQuery.removeEventListener('change', onStoreChange);
}

function getMediaQueryMatches(query: string) {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(query).matches;
}

interface CareersVideoCardProps {
  title: string;
  description: string;
  imageSrc: string;
  videoUrl: string;
}

export function CareersVideoCard({ title, description, imageSrc, videoUrl }: CareersVideoCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState<PointerPosition>({ x: 0, y: 0 });

  const isDesktopPointer = useSyncExternalStore(
    (onStoreChange) => subscribeMediaQuery(DESKTOP_POINTER_QUERY, onStoreChange),
    () => getMediaQueryMatches(DESKTOP_POINTER_QUERY),
    () => false
  );

  function handlePointerEnter() {
    if (!isDesktopPointer) return;
    setIsHovering(true);
  }

  function handlePointerLeave() {
    setIsHovering(false);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!isDesktopPointer) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  }

  const showDesktopButton = isDesktopPointer && isHovering;
  const showMobileButton = !isDesktopPointer;
  const showButton = showDesktopButton || showMobileButton;

  return (
    <div className='flex w-full shrink-0 flex-col gap-5.5 md:w-[calc(50%-10px)] md:gap-11'>
      <Dialog>
        <DialogTrigger asChild>
          <div
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            onPointerMove={handlePointerMove}
            className={cn(
              'relative aspect-360/202 w-full overflow-hidden rounded-lg bg-[#d9d9d9] md:aspect-video',
              isDesktopPointer && isHovering && 'cursor-none'
            )}
          >
            <Image src={imageSrc} alt={title} fill className='absolute inset-0 size-full object-cover' />

            {showButton ? (
              <Button
                type='button'
                variant='white'
                aria-label='Play video'
                className={cn(
                  'pointer-events-none absolute z-10 shadow-sm',
                  isDesktopPointer
                    ? 'top-0 left-0 gap-2 transition-opacity duration-150'
                    : 'right-4 bottom-4 flex size-15 items-center justify-center rounded-full p-0 md:size-12'
                )}
                style={
                  isDesktopPointer
                    ? {
                        transform: `translate(calc(${position.x}px - 50%), calc(${position.y}px - 50%))`
                      }
                    : undefined
                }
              >
                <Icon icon='Play' width={16} height={16} className={cn(isDesktopPointer && 'mr-2')} />
                {isDesktopPointer && 'Play video'}
              </Button>
            ) : null}
          </div>
        </DialogTrigger>
        <DialogContent className='block aspect-360/202 h-auto overflow-hidden rounded-2xl border-none bg-black p-0 md:aspect-905/507 md:max-w-226.25'>
          <iframe
            className='size-full'
            src={`${videoUrl}?autoplay=1`}
            title='Video player'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
          />
        </DialogContent>
      </Dialog>
      <div className='space-y-3 md:space-y-4.25'>
        <Typography variant='h4' tag='p' className='font-medium'>
          {title}
        </Typography>
        <Typography variant='h6' tag='p' className='text-foreground-secondary max-w-126.25'>
          {description}
        </Typography>
      </div>
    </div>
  );
}
