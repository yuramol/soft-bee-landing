'use client';

import { cva, VariantProps } from 'class-variance-authority';
import { forwardRef, InputHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

const COLORS = {
  primary: 'text-text',
  secondary: 'text-gray'
};

export const fieldVariant = cva(
  'placeholder:text-text-secondary box-border h-[50px] w-full gap-2 rounded-[6px] bg-white px-3.5 py-2.5 !text-body2 outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border border-transparent focus:border-blue',
        error: 'border border-orange-bold focus:border-orange-bold'
      },
      color: COLORS
    },
    defaultVariants: {
      variant: 'default',
      color: 'primary'
    }
  }
);

const iconsVariant = cva('absolute', {
  variants: {
    color: COLORS
  },
  defaultVariants: {
    color: 'primary'
  }
});

export type FieldProps = InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof fieldVariant> &
  VariantProps<typeof iconsVariant> & {
    error?: string | false | undefined;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    handleIcon?: () => void;
    wrapperClassName?: string;
  };

const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ className, type, error, startIcon, endIcon, variant, color, handleIcon, wrapperClassName, ...props }, ref) => {
    return (
      <div className={cn('relative flex w-full items-center', wrapperClassName)}>
        {startIcon && <div className={cn(iconsVariant({ color }), `left-3`)}>{startIcon}</div>}

        <input
          type={type}
          className={cn(
            fieldVariant({
              variant: variant || error ? 'error' : 'default',
              color
            }),
            startIcon && 'pl-10',
            className
          )}
          ref={ref}
          {...props}
        />
        {endIcon ? (
          <div className={cn(iconsVariant({ color }), 'right-3 cursor-pointer')} onClick={handleIcon}>
            {endIcon}
          </div>
        ) : null}
      </div>
    );
  }
);
Field.displayName = 'Field';

export { Field };
