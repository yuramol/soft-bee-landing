'use client';

import { cva, VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';
import * as LabelPrimitive from '@radix-ui/react-label';

const labelVariants = cva('text-description font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', {
  variants: {
    variant: {
      primary: '!text-black',
      secondary: '!text-gray'
    },
    size: {
      large: 'text-body1',
      medium: 'text-body3',
      small: 'text-description'
    },
    font: {
      medium: 'font-medium',
      normal: 'font-normal'
    }
  },
  defaultVariants: {
    variant: 'primary'
  }
});

export type LabelProps = React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>;

const Label = React.forwardRef<React.ComponentRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, variant, size, font, ...props }, ref) => (
    <LabelPrimitive.Root ref={ref} className={cn(labelVariants({ variant, size, font }), className)} {...props} />
  )
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
