'use client';

import { animate, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface CaseStudyResultsCardProps {
  title: string;
  description: string;
  bottomText: string;
}

function formatStatValue(value: number, decimals: number) {
  if (decimals > 0) {
    return value.toFixed(decimals);
  }
  return Math.round(value).toString();
}

export function CaseStudyResultsCard({ title, description, bottomText }: CaseStudyResultsCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const [animatedValue, setAnimatedValue] = useState(0);

  const match = title.match(/^([\d.]+)(.*)$/);
  const targetValue = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : title;
  const decimals = match && match[1].includes('.') ? match[1].split('.')[1].length : 0;

  useEffect(() => {
    if (!isInView || targetValue === 0) return;

    const controls = animate(0, targetValue, {
      duration: 1,
      ease: 'easeOut',
      onUpdate(latest) {
        setAnimatedValue(latest);
      }
    });

    return () => controls.stop();
  }, [isInView, targetValue]);

  const displayTitle = targetValue === 0 ? title : `${formatStatValue(animatedValue, decimals)}${suffix}`;

  return (
    <div ref={ref} className='bg-accent-dark text-muted flex h-full w-73.5 shrink-0 flex-col rounded-3xl p-6'>
      <div className='mb-28.75 text-[32px] font-semibold'>{displayTitle}</div>
      <p className='mb-28.75 text-[20px] leading-tight font-normal'>{description}</p>
      <p className='mt-auto text-[20px] leading-tight font-normal uppercase'>{bottomText}</p>
    </div>
  );
}
