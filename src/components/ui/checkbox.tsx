'use client';

import { cva, VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';

const checkboxVariants = cva(
  'focus-visible:ring-ring peer size-[18px] shrink-0 rounded-[2px] shadow focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-primary border-2',
        primary: 'border border-blue hover:bg-blue-light data-[state=checked]:bg-blue data-[state=checked]:text-white'
      }
    },
    defaultVariants: {
      variant: 'primary'
    }
  }
);

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & VariantProps<typeof checkboxVariants>
>(({ className, variant, ...props }, ref) => (
  <CheckboxPrimitive.Root ref={ref} className={cn(checkboxVariants({ variant }), className)} {...props}>
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
      <CheckIcon className='size-3.5' />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
