import { cva, VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { FieldError } from 'react-hook-form';

import { cn } from '@/lib/utils';

export const inputVariants = cva(
  'focus-visible:ring-ring flex h-[52px] w-full rounded-full border border-border focus:border-brand-black/50 bg-transparent pl-[22px] py-1 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-semibold placeholder:text-16 placeholder:text-brand-black/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent',
  {
    variants: {
      variant: {
        primary: 'text-brand-black text-16',
        secondary: 'text-black placeholder:text-black'
      }
    },
    defaultVariants: {
      variant: 'primary'
    }
  }
);

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputVariants> & {
    error?: FieldError | string;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;

    handleIcon?: () => void;
  };

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, startIcon, endIcon, variant, handleIcon, ...props }, ref) => {
    return (
      <div className='flex w-full flex-col gap-1'>
        <div className='relative flex w-full items-center'>
          {startIcon && <div className={`absolute left-3`}>{startIcon}</div>}
          <input {...props} ref={ref} type={type} className={cn(inputVariants({ variant }), endIcon && 'pr-10', className)} />
          {endIcon ? (
            <div className='absolute right-4 cursor-pointer' onClick={handleIcon}>
              {endIcon}
            </div>
          ) : null}
        </div>
        {error && <span className='text-destructive w-full text-left text-xs'>{typeof error === 'string' ? error : error.message}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
