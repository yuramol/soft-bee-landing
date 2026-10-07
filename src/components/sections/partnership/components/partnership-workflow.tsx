'use client';

import { useEffect, useRef, useState } from 'react';

const VIDEO_SRC = '/videos/partnership/partnership-ribbons.webm';
const VIDEO_POSTER = '/videos/partnership/partnership-ribbons-poster.webp';
const VIDEO_ARIA_LABEL = 'Graphite and lime ribbons weaving together, representing design and engineering in collaboration.';

export default function PartnershipWorkflow() {
  const containerRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isSourceReady, setIsSourceReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let idleId = 0;
    let timeoutId = 0;
    let cancelled = false;
    let isVisible = false;

    function enableSource() {
      if (cancelled || !isVisible) return;
      setIsSourceReady(true);
    }

    function scheduleSource() {
      if (typeof window.requestIdleCallback === 'function') {
        idleId = window.requestIdleCallback(enableSource, { timeout: 3000 });
        return;
      }
      timeoutId = window.setTimeout(enableSource, 1500);
    }

    function trySchedule() {
      if (!isVisible) return;
      if (document.readyState === 'complete') {
        scheduleSource();
        return;
      }
      window.addEventListener('load', scheduleSource, { once: true });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) return;
        isVisible = true;
        observer.disconnect();
        trySchedule();
      },
      { rootMargin: '80px 0px', threshold: 0 }
    );

    observer.observe(container);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener('load', scheduleSource);
      if (idleId && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  useEffect(() => {
    if (!isSourceReady) return;

    const video = videoRef.current;
    if (!video) return;

    void video.play().catch(() => {
      // Autoplay can be blocked; poster remains visible.
    });
  }, [isSourceReady]);

  return (
    <figure ref={containerRef} className='partnership-visual'>
      <video
        ref={videoRef}
        poster={VIDEO_POSTER}
        preload='none'
        autoPlay={isSourceReady}
        loop
        muted
        playsInline
        src={isSourceReady ? VIDEO_SRC : undefined}
        aria-label={VIDEO_ARIA_LABEL}
      />
    </figure>
  );
}
