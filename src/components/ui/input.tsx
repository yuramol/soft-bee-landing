import { cva, VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { FieldError } from 'react-hook-form';

import { cn } from '@/lib/utils';

export const inputVariants = cva(
  'focus-visible:ring-ring flex h-10 w-full rounded-[6px] border border-input bg-transparent px-3 py-1 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-semibold placeholder:text-body3 focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent',
  {
    variants: {
      variant: {
        primary: 'text-black placeholder:text-gray',
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
      <div className='relative flex w-full items-center'>
        {startIcon && <div className={`absolute left-3`}>{startIcon}</div>}
        <input
          {...props}
          ref={ref}
          type={type}
          className={cn(inputVariants({ variant }), 'text-body3', error && 'border-orange-bold', endIcon && 'pr-10', className)}
        />
        {endIcon ? (
          <div className='absolute right-3 cursor-pointer' onClick={handleIcon}>
            {endIcon}
          </div>
        ) : null}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
