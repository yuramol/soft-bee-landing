'use client';

import { HTMLProps } from 'react';

import { cn } from '@/lib/utils';

type LoaderProps = HTMLProps<HTMLDivElement>;

export const Loader = ({ className }: LoaderProps) => {
  return (
    <div
      className={cn(
        'ml-2 inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]',
        className
      )}
      role='status'
    >
      <span className='!absolute !-m-px !h-px !w-px !overflow-hidden !border-0 !p-0 !whitespace-nowrap ![clip:rect(0,0,0,0)]'>
        Loading...
      </span>
    </div>
  );
};
