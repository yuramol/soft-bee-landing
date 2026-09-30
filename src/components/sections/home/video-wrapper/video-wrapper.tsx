'use client';

import { PointerEvent, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { motion, useSpring, useMotionValue, useScroll, useTransform } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import content from './content.json';

const VIDEO_SRC = '/videos/home.mp4';
const VIDEO_POSTER = '/videos/home-poster.webp';
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
  const pendingPlayRef = useRef(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSourceReady, setIsSourceReady] = useState(false);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const mouseX = useSpring(cursorX, springConfig);
  const mouseY = useSpring(cursorY, springConfig);

  const isDesktopPointer = useSyncExternalStore(
    (onStoreChange) => subscribeMediaQuery(DESKTOP_POINTER_QUERY, onStoreChange),
    () => getMediaQueryMatches(DESKTOP_POINTER_QUERY),
    () => false
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isSourceReady) return;

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
  }, [isSourceReady]);

  useEffect(() => {
    if (!isSourceReady || !pendingPlayRef.current) return;

    const video = videoRef.current;
    if (!video) return;

    pendingPlayRef.current = false;
    void video.play().then(() => {
      setIsPlaying(true);
    });
  }, [isSourceReady]);

  function pauseVideoPlayback() {
    const video = videoRef.current;
    if (!video) return;

    shouldResumeRef.current = false;
    video.pause();
    setIsPlaying(false);
  }

  function playVideoPlayback() {
    shouldResumeRef.current = false;

    if (!isSourceReady) {
      pendingPlayRef.current = true;
      setIsSourceReady(true);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    void video.play().then(() => {
      setIsPlaying(true);
    });
  }

  function handlePointerEnter(event: PointerEvent<HTMLDivElement>) {
    if (!isDesktopPointer) return;
    setIsHovering(true);
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      cursorX.set(x);
      cursorY.set(y);
      mouseX.jump(x);
      mouseY.jump(y);
    }
  }

  function handlePointerLeave() {
    setIsHovering(false);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!isDesktopPointer) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    cursorX.set(event.clientX - rect.left);
    cursorY.set(event.clientY - rect.top);
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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end']
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.65, 1]);

  return (
    <div
      ref={containerRef}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      className={cn(
        'relative aspect-video w-full',
        'max-h-[calc(100dvh-10px)] md:max-h-[calc(100dvh-20px)]',
        isDesktopPointer && isHovering && 'cursor-none'
      )}
    >
      <motion.section style={{ scale }} className='relative h-full w-full origin-center overflow-hidden rounded-2xl bg-[#d9d9d9]'>
        <video
          ref={videoRef}
          poster={VIDEO_POSTER}
          preload='none'
          playsInline
          src={isSourceReady ? VIDEO_SRC : undefined}
          onEnded={handleVideoEnded}
          className='absolute inset-0 size-full object-cover'
        />
      </motion.section>

      {showButton ? (
        <motion.div
          className={cn('absolute z-10', isDesktopPointer ? 'top-0 left-0' : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2')}
          style={isDesktopPointer ? { x: mouseX, y: mouseY } : undefined}
        >
          <Button
            type='button'
            variant='white'
            aria-label={isPlaying ? content.stopVideoAriaLabel : content.playVideoAriaLabel}
            tabIndex={0}
            onClick={handlePlayClick}
            className={cn(
              'gap-2 shadow-sm',
              isDesktopPointer && '-translate-x-1/2 -translate-y-1/2 cursor-none transition-opacity duration-150'
            )}
            leftIcon={isPlaying ? undefined : <Icon icon='Play' width={16} height={16} />}
          >
            {isPlaying ? 'Stop video' : 'Play video'}
          </Button>
        </motion.div>
      ) : null}
    </div>
  );
}
