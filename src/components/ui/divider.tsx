'use client';

import * as React from 'react';

// Lib
import { cn } from '@/lib/utils';
import { Separator } from '@ui/separator';
// Legos
import { Typography } from '@ui/typography';

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  textAlign?: 'center' | 'left' | 'right';
  textClassName?: string;
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, textClassName, children, textAlign = 'center', ...props }, ref) => {
    const separatorStyle = 'bg-blue-light flex-1';
    const typographyStyle = 'text-blue-light font-normal';

    const renderTextAlignDivider = () => {
      switch (textAlign) {
        case 'left':
          return (
            <div className={cn('flex items-center gap-4', className)} ref={ref} {...props}>
              <Typography variant='body1' className={cn(typographyStyle, textClassName)}>
                {children}
              </Typography>
              <Separator className={separatorStyle} />
            </div>
          );
        case 'center':
          return (
            <div className={cn('flex items-center gap-4', className)} ref={ref} {...props}>
              <Separator className={separatorStyle} />
              <Typography variant='body1' className={cn(typographyStyle, textClassName)}>
                {children}
              </Typography>
              <Separator className={separatorStyle} />
            </div>
          );
        case 'right':
          return (
            <div className={cn('flex items-center gap-4', className)} ref={ref} {...props}>
              <Separator className={separatorStyle} />
              <Typography variant='body1' className={cn(typographyStyle, textClassName)}>
                {children}
              </Typography>
            </div>
          );
        default:
          return (
            <p className={className} {...props}>
              {children}
            </p>
          );
      }
    };

    return renderTextAlignDivider();
  }
);
Divider.displayName = 'Divider';

export { Divider };
