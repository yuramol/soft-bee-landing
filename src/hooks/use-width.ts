'use client';

import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '@/constants/breakpoints';

export function useWidth() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => setWidth(window.innerWidth);
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    width,
    isSm: width >= BREAKPOINTS.SM,
    isMd: width >= BREAKPOINTS.MD,
    isLg: width >= BREAKPOINTS.LG,
    isXl: width >= BREAKPOINTS.XL,
    is2xl: width >= BREAKPOINTS['2XL']
  };
}
