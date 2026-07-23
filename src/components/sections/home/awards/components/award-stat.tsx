'use client';

import { animate, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

function formatStatValue(value: number, decimals: number) {
  if (decimals > 0) {
    return value.toFixed(decimals);
  }

  return Math.round(value).toString();
}

export interface AwardStatProps {
  value: number;
  description: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export function AwardStat({ value, suffix = '', description, decimals = 0, className }: AwardStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, value, {
      duration: 1.6,
      ease: 'easeOut',
      onUpdate(latest) {
        setAnimatedValue(latest);
      }
    });

    return () => controls.stop();
  }, [isInView, value]);

  return (
    <div ref={ref} className={cn('flex flex-col items-start', className)}>
      <Typography variant='display2' tag='span' className='text-foreground-inverse font-light'>
        {formatStatValue(animatedValue, decimals)}
        {suffix}
      </Typography>
      <Typography variant='body3' className='text-white/50'>
        {description}
      </Typography>
    </div>
  );
}
