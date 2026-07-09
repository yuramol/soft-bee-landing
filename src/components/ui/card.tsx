import * as React from 'react';

import { cn } from '@/lib/utils';
import { Typography, TypographyProps } from '@ui/typography';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('bg-card text-card-foreground rounded-xl border shadow', className)} {...props} />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

type CardTitleProps = Partial<TypographyProps> & React.HTMLAttributes<HTMLHeadingElement>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(({ className, variant = 'body3', ...props }, ref) => (
  <Typography variant={variant} className={cn('leading-none font-semibold tracking-tight', className)} {...props} />
));
CardTitle.displayName = 'CardTitle';

type CardDescriptionProps = Partial<TypographyProps> & React.HTMLAttributes<HTMLParagraphElement>;

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ className, variant = 'description', ...props }, ref) => (
    <Typography variant={variant} className={cn('text-muted-foreground', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
