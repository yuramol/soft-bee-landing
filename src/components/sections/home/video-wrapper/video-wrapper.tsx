'use client';

import { PointerEvent, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface PointerPosition {
  x: number;
  y: number;
}

export function VideoWrapper() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState<PointerPosition>({ x: 0, y: 0 });

  function handlePointerEnter() {
    setIsHovering(true);
  }

  function handlePointerLeave() {
    setIsHovering(false);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    setPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  }

  function handlePlayClick() {
    // Video playback will be wired when media is available.
  }

  return (
    <section
      ref={containerRef}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      className={cn('relative aspect-video w-full overflow-hidden rounded-2xl bg-[#d9d9d9]', isHovering && 'cursor-none')}
    >
      <Button
        type='button'
        variant='white'
        aria-label='Play video'
        tabIndex={isHovering ? 0 : -1}
        onClick={handlePlayClick}
        className={cn(
          'pointer-events-none absolute top-0 left-0 z-10 gap-2 shadow-sm transition-opacity duration-150',
          isHovering ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          transform: `translate(calc(${position.x}px - 50%), calc(${position.y}px - 50%))`
        }}
        leftIcon={<Icon icon='Play' width={16} height={16} />}
      >
        Play video
      </Button>
    </section>
  );
}
