'use client';

import { KeyboardEvent, MouseEvent, PointerEvent, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import content from './content.json';

const VIDEO_SRC = '/videos/home.webm';
const VIDEO_POSTER = '/videos/home-poster.webp';
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

export function VideoWrapper() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const shouldResumeRef = useRef(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | undefined>(undefined);
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

  const blobUrlRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isPlayingRef = useRef(false);

  function enableSource() {
    if (videoSrc) return;
    const currentBlob = blobUrlRef.current;
    if (currentBlob) {
      setVideoSrc(currentBlob);
      return;
    }
    setVideoSrc(VIDEO_SRC);
  }

  // Preload video with fetch after page load so it is reliably downloaded in the background and cached in memory
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    abortControllerRef.current = controller;

    function preloadVideoWithFetch() {
      if (cancelled) return;

      void fetch(VIDEO_SRC, { signal: controller.signal })
        .then((response) => {
          if (!response.ok) throw new Error('Video network response error');
          return response.blob();
        })
        .then((blob) => {
          if (cancelled) return;
          const blobUrl = URL.createObjectURL(blob);
          blobUrlRef.current = blobUrl;
          setVideoSrc(blobUrl);
          const video = videoRef.current;
          if (video && !isPlayingRef.current) {
            video.src = blobUrl;
            video.load();
          }
        })
        .catch((error: unknown) => {
          if (cancelled || (error instanceof Error && error.name === 'AbortError')) return;
          setVideoSrc(VIDEO_SRC);
        });
    }

    function handlePageLoad() {
      if (cancelled) return;
      preloadVideoWithFetch();
    }

    if (document.readyState === 'complete') {
      handlePageLoad();
    } else {
      window.addEventListener('load', handlePageLoad, { once: true });
    }

    return () => {
      cancelled = true;
      controller.abort();
      window.removeEventListener('load', handlePageLoad);
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, []);

  // Pause playback when scrolled offscreen and resume when scrolled back in
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !videoSrc) return;

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
        void video
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            setIsPlaying(false);
          });
      },
      { threshold: 0 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [videoSrc]);

  function startPlayback() {
    shouldResumeRef.current = false;
    const video = videoRef.current;
    if (!video) return;

    if (video.ended) {
      video.currentTime = 0;
    }

    const currentBlob = blobUrlRef.current;
    if (currentBlob) {
      if (video.src !== currentBlob) {
        video.src = currentBlob;
        video.load();
      }
      if (videoSrc !== currentBlob) {
        setVideoSrc(currentBlob);
      }
    } else {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (!video.src || (!video.src.includes(VIDEO_SRC) && !video.src.startsWith('blob:'))) {
        video.src = VIDEO_SRC;
        video.load();
      }
      if (videoSrc !== VIDEO_SRC) {
        setVideoSrc(VIDEO_SRC);
      }
    }

    setIsPlaying(true);
    isPlayingRef.current = true;

    void video
      .play()
      .then(() => {
        setIsPlaying(true);
        isPlayingRef.current = true;
      })
      .catch((error: unknown) => {
        console.warn('Playback was prevented:', error);
        setIsPlaying(false);
        isPlayingRef.current = false;
      });
  }

  function pauseVideoPlayback() {
    const video = videoRef.current;
    if (!video) return;

    shouldResumeRef.current = false;
    video.pause();
    setIsPlaying(false);
    isPlayingRef.current = false;
  }

  function handlePlayClick() {
    enableSource();
    if (isPlaying) {
      pauseVideoPlayback();
      return;
    }

    startPlayback();
  }

  function handleContainerClick() {
    handlePlayClick();
  }

  function handleButtonClick(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    handlePlayClick();
  }

  function handleContainerKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handlePlayClick();
    }
  }

  function handlePointerEnter(event: PointerEvent<HTMLDivElement>) {
    enableSource();
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
    enableSource();
    if (!isDesktopPointer) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    cursorX.set(event.clientX - rect.left);
    cursorY.set(event.clientY - rect.top);
  }

  function handleTouchStart() {
    enableSource();
  }

  function handleVideoEnded() {
    shouldResumeRef.current = false;
    setIsPlaying(false);
    isPlayingRef.current = false;
  }

  function handleVideoPlay() {
    setIsPlaying(true);
    isPlayingRef.current = true;
  }

  function handleVideoPause() {
    if (!shouldResumeRef.current) {
      setIsPlaying(false);
      isPlayingRef.current = false;
    }
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
      role='region'
      aria-label={content.playVideoAriaLabel}
      tabIndex={-1}
      onClick={handleContainerClick}
      onKeyDown={handleContainerKeyDown}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      onTouchStart={handleTouchStart}
      className={cn(
        'relative aspect-video w-full cursor-pointer',
        'max-h-[calc(100dvh-10px)] md:max-h-[calc(100dvh-20px)]',
        isDesktopPointer && isHovering && 'cursor-none'
      )}
    >
      <motion.section style={{ scale }} className='relative h-full w-full origin-center overflow-hidden rounded-2xl bg-[#d9d9d9]'>
        <video
          ref={videoRef}
          poster={VIDEO_POSTER}
          preload={videoSrc ? 'auto' : 'none'}
          playsInline
          muted
          src={videoSrc}
          onEnded={handleVideoEnded}
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
          className='absolute inset-0 size-full object-cover'
        />
      </motion.section>

      {showButton ? (
        <motion.div
          className={cn(
            'absolute z-10',
            isDesktopPointer ? 'pointer-events-none top-0 left-0' : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
          )}
          style={isDesktopPointer ? { x: mouseX, y: mouseY } : undefined}
        >
          <Button
            type='button'
            variant='white'
            aria-label={isPlaying ? content.stopVideoAriaLabel : content.playVideoAriaLabel}
            tabIndex={0}
            onClick={handleButtonClick}
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
