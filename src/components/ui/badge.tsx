import { cva, VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'focus:ring-ring inline-flex items-center rounded-sm px-3.5 py-1.5 text-[18px] md:text-[24px] leading-[25px] md:leading-[33px] font-medium transition-colors focus:outline-none',
  {
    variants: {
      variant: {
        default: 'bg-[#8A8A8A17] text-brand-black',
        primary: 'bg-electric-green/9 text-electric-green'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  title?: string;
}

function Badge({ className, variant, title, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {title || children}
    </div>
  );
}

export { Badge, badgeVariants };
