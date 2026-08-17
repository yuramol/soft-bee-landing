import * as React from 'react';
import { Input, type InputProps } from '@/components/ui/input';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

export interface SearchInputProps extends InputProps {
  wrapperClassName?: string;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(({ className, wrapperClassName, ...props }, ref) => {
  return (
    <div className={cn('relative w-full', wrapperClassName)}>
      <Icon icon='MagnifyingGlass' className='absolute top-1/2 left-4 z-10 h-5 w-5 -translate-y-1/2 text-gray-400' />
      <Input
        type='text'
        ref={ref}
        className={cn(
          'border-border focus:border-brand-black/50 h-12 w-full rounded-full pr-4 pl-11 text-[16px] focus-visible:ring-0',
          className
        )}
        {...props}
      />
    </div>
  );
});

SearchInput.displayName = 'SearchInput';
