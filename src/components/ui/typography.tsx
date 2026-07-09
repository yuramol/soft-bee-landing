'use client';

import { createElement, FC, HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

type TagVariants = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
export type TypographyVariants = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'body3' | 'description' | 'caption';

// Mapping between `variant` and default HTML tag
const defaultTagMapping: Record<TypographyVariants, TagVariants> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body1: 'p',
  body2: 'p',
  body3: 'p',
  description: 'p',
  caption: 'span'
};

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant?: TypographyVariants;
  tag?: TagVariants;
  className?: string;
}

export const Typography: FC<TypographyProps> = ({ children, variant, tag, className, ...props }) => {
  // Automatically determine the tag based on the variant if tag is not provided
  const ComponentTag = tag || (variant && defaultTagMapping[variant]) || 'p';

  const getClassNames = () => {
    switch (variant) {
      case 'h1':
        return 'text-h1 !leading-h1 font-semibold';
      case 'h2':
        return '!text-h2 !leading-h2';
      case 'h3':
        return '!text-h3 !leading-h3';
      case 'h4':
        return '!text-h4 !leading-h4';
      case 'h5':
        return '!text-h5 !leading-h5';
      case 'h6':
        return '!text-h6 !leading-h6';
      case 'body1':
        return '!text-body1 !leading-body1';
      case 'body2':
        return '!text-body2 !leading-body2';
      case 'body3':
        return '!text-body3 !leading-body3';
      case 'description':
        return '!text-description !leading-description';
      case 'caption':
        return '!text-caption !leading-caption';
      default:
        return '!text-body1 !leading-tiny';
    }
  };

  return createElement(ComponentTag, { className: cn(getClassNames(), className), ...props }, children);
};
