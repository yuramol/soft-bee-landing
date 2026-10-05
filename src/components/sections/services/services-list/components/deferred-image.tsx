'use client';

import Image from 'next/image';
import { useLayoutEffect, useRef, useState } from 'react';

interface DeferredImageProps {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
}

const ROOT_MARGIN_PX = 120;

function isNearViewport(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  // Hidden layouts (display:none) report a zero rect that would otherwise look "near".
  if (rect.width === 0 || rect.height === 0) return false;
  return rect.top < window.innerHeight + ROOT_MARGIN_PX && rect.bottom > -ROOT_MARGIN_PX;
}

export function DeferredImage({ src, alt, sizes, className }: DeferredImageProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useLayoutEffect(() => {
    if (shouldLoad) return;

    const element = ref.current;
    if (!element) return;

    if (isNearViewport(element)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: `${ROOT_MARGIN_PX}px 0px`, threshold: 0 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div ref={ref} className='absolute inset-0'>
      {shouldLoad ? <Image src={src} alt={alt} fill sizes={sizes} loading='lazy' className={className} /> : null}
    </div>
  );
}
