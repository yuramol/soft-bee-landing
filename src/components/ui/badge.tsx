import { cva, VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'focus:ring-ring inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/80 border-transparent shadow',
        primary: 'rounded-full border-0 bg-blue-light px-[14px] py-2 font-normal text-blue',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent',
        destructive:
          'text-destructive-foreground hover:bg-destructive/80 w-fit rounded border-transparent bg-[#F7EDED] px-1.5 py-1 text-[#AF4B4B]',
        outline: 'text-foreground'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
