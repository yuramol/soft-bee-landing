'use client';

import { ReactNode, useEffect, useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

export interface ToolItemProps {
  icon: ReactNode;
  name: string;
  description: string;
  invertOnHover?: boolean;
  className?: string;
  onOpenChange?: (isOpen: boolean) => void;
}

const triggerOpenIconSurface =
  'group-data-[state=open]/trigger:border-background-inverse group-data-[state=open]/trigger:bg-background-inverse';
const triggerOpenIconInvert = 'group-data-[state=open]/trigger:brightness-0 group-data-[state=open]/trigger:invert';

function canHover() {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

function preventFocusScroll(event: Event) {
  event.preventDefault();
}

export function ToolItem({ icon, name, description, invertOnHover = false, className, onOpenChange }: ToolItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  function handleMouseEnter() {
    if (!canHover()) return;
    setIsOpen(true);
  }

  function handleMouseLeave() {
    if (!canHover()) return;
    setIsOpen(false);
  }

  //prevent scrolling back to tools item
  useEffect(() => {
    if (!isOpen) return;

    function handleScroll() {
      setIsOpen(false);
    }

    window.addEventListener('scroll', handleScroll, true);
    return function cleanup() {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type='button'
          aria-label={`${name}. ${description}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn('group/trigger relative flex flex-col items-center border-0 bg-transparent p-0 outline-none', className)}
        >
          <div
            className={cn(
              'border-border bg-background relative flex size-17.5 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 sm:size-17.5 lg:size-36',
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
        onOpenAutoFocus={preventFocusScroll}
        onCloseAutoFocus={preventFocusScroll}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className='border-border bg-background text-foreground shadow-tool-tooltip flex w-72 max-w-[calc(100vw-2rem)] flex-col gap-3 rounded-xl border p-5 text-base sm:w-87.5 sm:gap-4 sm:rounded-[16px] sm:p-8'
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
