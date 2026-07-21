'use client';

import { PointerEvent, useEffect, useRef, useState, useSyncExternalStore } from 'react';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface PointerPosition {
  x: number;
  y: number;
}

const VIDEO_SRC = '/videos/home.mp4';
const DESKTOP_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

function subscribeMediaQuery(query: string, onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(query);
  mediaQuery.addEventListener('change', onStoreChange);
  return () => mediaQuery.removeEventListener('change', onStoreChange);
}

function getMediaQueryMatches(query: string) {
  return window.matchMedia(query).matches;
}

export function VideoWrapper() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const shouldResumeRef = useRef(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState<PointerPosition>({ x: 0, y: 0 });

  const isDesktopPointer = useSyncExternalStore(
    (onStoreChange) => subscribeMediaQuery(DESKTOP_POINTER_QUERY, onStoreChange),
    () => getMediaQueryMatches(DESKTOP_POINTER_QUERY),
    () => false
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry) return;

        const video = videoRef.current;
        if (!video) return;

        if (!entry.isIntersecting) {
          if (video.paused) return;

          shouldResumeRef.current = true;
          video.pause();
          setIsPlaying(false);
          return;
        }

        if (!shouldResumeRef.current) return;

        shouldResumeRef.current = false;
        void video.play().then(() => {
          setIsPlaying(true);
        });
      },
      { threshold: 0 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  function pauseVideoPlayback() {
    const video = videoRef.current;
    if (!video) return;

    shouldResumeRef.current = false;
    video.pause();
    setIsPlaying(false);
  }

  function playVideoPlayback() {
    const video = videoRef.current;
    if (!video) return;

    shouldResumeRef.current = false;
    void video.play().then(() => {
      setIsPlaying(true);
    });
  }

  function handlePointerEnter() {
    if (!isDesktopPointer) return;
    setIsHovering(true);
  }

  function handlePointerLeave() {
    setIsHovering(false);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!isDesktopPointer) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    setPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  }

  function handlePlayClick() {
    if (isPlaying) {
      pauseVideoPlayback();
      return;
    }

    playVideoPlayback();
  }

  function handleVideoEnded() {
    shouldResumeRef.current = false;
    setIsPlaying(false);
  }

  const showDesktopButton = isDesktopPointer && isHovering;
  const showMobileButton = !isDesktopPointer && !isPlaying;
  const showButton = showDesktopButton || showMobileButton;

  return (
    <section
      ref={containerRef}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      className={cn(
        'relative aspect-video w-full overflow-hidden rounded-2xl bg-[#d9d9d9]',
        isDesktopPointer && isHovering && 'cursor-none'
      )}
    >
      <video
        ref={videoRef}
        src={`${VIDEO_SRC}#t=0.001`}
        preload='metadata'
        playsInline
        onEnded={handleVideoEnded}
        className='absolute inset-0 size-full object-cover'
      />

      {showButton ? (
        <Button
          type='button'
          variant='white'
          aria-label={isPlaying ? 'Stop video' : 'Play video'}
          tabIndex={0}
          onClick={handlePlayClick}
          className={cn(
            'absolute z-10 gap-2 shadow-sm',
            isDesktopPointer ? 'top-0 left-0 transition-opacity duration-150' : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
          )}
          style={
            isDesktopPointer
              ? {
                  transform: `translate(calc(${position.x}px - 50%), calc(${position.y}px - 50%))`
                }
              : undefined
          }
          leftIcon={isPlaying ? undefined : <Icon icon='Play' width={16} height={16} />}
        >
          {isPlaying ? 'Stop video' : 'Play video'}
        </Button>
      ) : null}
    </section>
  );
}
