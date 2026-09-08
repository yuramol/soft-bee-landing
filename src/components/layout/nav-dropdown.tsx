'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface SubLink {
  label: string;
  href: string;
}

interface NavDropdownProps {
  label: string;
  subLinks: SubLink[];
  textColor: string;
}

export function NavDropdown({ label, subLinks, textColor }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 50);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <div
        className='relative flex h-12 cursor-pointer items-center before:absolute before:-bottom-2 before:left-0 before:h-2 before:w-full before:bg-transparent'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <DropdownMenuTrigger asChild>
          <div
            className={cn(
              'text-16 flex cursor-pointer items-center gap-1 font-medium whitespace-nowrap transition-opacity outline-none hover:opacity-80',
              textColor
            )}
          >
            {label}
            <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', isOpen && 'rotate-180')} />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className='flex min-w-29 flex-col gap-2 rounded-[16px] border-none bg-white px-3.5 py-3.75 shadow-[0px_1px_2px_0px_#0000001A]'
          sideOffset={8}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {subLinks.map((subLink, index) => (
            <React.Fragment key={subLink.label}>
              {index > 0 && <div className='bg-foreground/10 -mx-3.5 h-px' />}
              <DropdownMenuItem
                asChild
                className='focus:text-foreground cursor-pointer justify-center px-0 py-0 focus:bg-transparent data-highlighted:bg-transparent'
              >
                <Link href={subLink.href} className='text-foreground/50 hover:text-foreground text-[16px] transition-colors'>
                  {subLink.label}
                </Link>
              </DropdownMenuItem>
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
}
