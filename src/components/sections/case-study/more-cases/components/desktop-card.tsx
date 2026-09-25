import { PointerEvent, useState } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { CASE_STUDIES } from '@/components/sections/case-studies/data';

import content from '../content.json';

interface PointerPosition {
  x: number;
  y: number;
}

interface DesktopCardProps {
  c: (typeof CASE_STUDIES)[0];
  index: number;
  isDesktopPointer: boolean;
  onClick: () => void;
}

export function DesktopCard({ c, index, isDesktopPointer, onClick }: DesktopCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState<PointerPosition>({ x: 0, y: 0 });

  function handlePointerEnter() {
    if (!isDesktopPointer) return;
    setIsHovering(true);
  }

  function handlePointerLeave() {
    setIsHovering(false);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>, containerElement: HTMLDivElement) {
    if (!isDesktopPointer) return;
    const rect = containerElement.getBoundingClientRect();
    setPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  }

  return (
    <div
      className={cn('sticky top-0 z-10 flex h-screen w-full flex-col overflow-hidden rounded-4xl', isHovering && 'cursor-none')}
      style={{ zIndex: 10 + index }}
    >
      <div
        className='relative h-full w-full'
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerMove={(e) => handlePointerMove(e, e.currentTarget)}
        onClick={onClick}
      >
        <Image src={c.moreCasesImage || c.image} alt={c.title} fill className='object-cover' />

        <div className='pointer-events-none absolute top-10.5 left-10.5'>
          <Typography variant='body2' className='tracking-widest text-black uppercase'>
            [{content.topText}]
          </Typography>
        </div>

        <div className='pointer-events-none absolute right-16 bottom-16 flex items-baseline gap-6'>
          <Typography variant='h1' className='text-[96px] leading-none font-normal text-black'>
            {c.title}
          </Typography>
          <Typography variant='body1' className='text-[24px] font-normal text-black/80'>
            [{c.year}]
          </Typography>
        </div>

        {isDesktopPointer && isHovering && (
          <Button
            type='button'
            variant='white'
            className='pointer-events-none absolute top-0 left-0 z-20 shadow-sm transition-opacity duration-150'
            style={{
              transform: `translate(calc(${position.x}px - 50%), calc(${position.y}px - 50%))`
            }}
          >
            {content.hoverButtonText}
          </Button>
        )}
      </div>
    </div>
  );
}
