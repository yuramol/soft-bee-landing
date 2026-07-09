'use client';

import Link from 'next/link';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { Typography, TypographyVariants } from '@ui/typography';

export interface NextLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  isDisabled?: boolean;
  typographyClassName?: string;
  variant?: TypographyVariants;
}

const NextLink = React.forwardRef<HTMLAnchorElement, NextLinkProps>(
  ({ children, href, className, isDisabled, typographyClassName, variant = 'body1', ...restProps }, ref) => {
    const renderTypography = () => (
      <Typography
        className={cn('text-blue font-medium underline transition-colors hover:text-black', typographyClassName)}
        variant={variant}
      >
        {children}
      </Typography>
    );

    return isDisabled ? (
      renderTypography()
    ) : (
      <Link ref={ref} href={href ?? ''} className={cn(className)} {...restProps}>
        {renderTypography()}
      </Link>
    );
  }
);
NextLink.displayName = 'NextLink';

export { NextLink };
