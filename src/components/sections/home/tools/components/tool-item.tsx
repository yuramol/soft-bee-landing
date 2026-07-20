'use client';

import { ReactNode, useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

export interface ToolItemProps {
  icon: ReactNode;
  name: string;
  description: string;
  invertOnHover?: boolean;
  className?: string;
}

const triggerOpenOpacity = 'group-data-[state=open]/trigger:opacity-100';
const triggerOpenIconSurface =
  'group-data-[state=open]/trigger:border-background-inverse group-data-[state=open]/trigger:bg-background-inverse';
const triggerOpenIconInvert = 'group-data-[state=open]/trigger:brightness-0 group-data-[state=open]/trigger:invert';

function canHover() {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

export function ToolItem({ icon, name, description, invertOnHover = false, className }: ToolItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    setIsOpen(nextOpen);
  }

  function handleMouseEnter() {
    if (!canHover()) return;
    setIsOpen(true);
  }

  function handleMouseLeave() {
    if (!canHover()) return;
    setIsOpen(false);
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type='button'
          aria-label={`${name}. ${description}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn('group/trigger relative flex flex-col items-center border-0 bg-transparent p-0 outline-none', className)}
        >
          <span
            aria-hidden
            className={cn(
              'bg-primary/55 pointer-events-none absolute top-[40%] left-1/2 z-0 size-17.5 -translate-x-1/2 rounded-full opacity-0 blur-3xl transition-opacity duration-300 sm:size-17.5 lg:size-36',
              triggerOpenOpacity
            )}
          />

          <div
            className={cn(
              'border-border bg-background relative z-10 flex size-17.5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 sm:size-17.5 lg:size-36',
              triggerOpenIconSurface
            )}
          >
            <span
              className={cn(
                'flex size-9 items-center justify-center transition-[filter] duration-300 lg:size-22 [&_svg]:size-full',
                invertOnHover && triggerOpenIconInvert
              )}
            >
              {icon}
            </span>
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent
        side='bottom'
        align='center'
        sideOffset={12}
        collisionPadding={10}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className='border-border bg-background text-foreground flex w-87.5 max-w-[calc(100vw-2rem)] flex-col gap-4 rounded-[16px] border p-8 text-base shadow-xs'
      >
        <Typography variant='body1' className='font-medium'>
          {name}
        </Typography>
        <Typography variant='body3' className='text-foreground-secondary'>
          {description}
        </Typography>
      </PopoverContent>
    </Popover>
  );
}
