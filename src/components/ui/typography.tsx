'use client';

import { createElement, FC, HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

type TagVariants = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
export type TypographyVariants =
  | 'display1'
  | 'display2'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body1'
  | 'body2'
  | 'body3'
  | 'description'
  | 'caption'
  | 'caption2';

// Mapping between `variant` and default HTML tag
const defaultTagMapping: Record<TypographyVariants, TagVariants> = {
  display1: 'h2',
  display2: 'h2',
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
  caption: 'span',
  caption2: 'span'
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
      case 'display1':
        return 'text-96 leading-[1.17]';
      case 'display2':
        return 'text-80 leading-[1.17]';
      case 'h1':
        return 'text-70 leading-[1.17]';
      case 'h2':
        return 'text-48 leading-[1.24]';
      case 'h3':
        return 'text-32 leading-[1.24]';
      case 'h4':
        return 'text-24 leading-[1.37]';
      case 'h5':
        return 'text-20 leading-[1.37]';
      case 'h6':
        return 'text-18 leading-[1.37]';
      case 'body1':
        return 'text-24 leading-[1.37]';
      case 'body2':
        return 'text-20 leading-[1.37]';
      case 'body3':
        return 'text-18 leading-[1.37]';
      case 'description':
        return 'text-16 leading-[1.10]';
      case 'caption':
        return 'text-16 leading-[1.10]';
      case 'caption2':
        return 'text-14 leading-[1.10]';
      default:
        return 'text-24 leading-[1.37]';
    }
  };

  return createElement(ComponentTag, { className: cn(getClassNames(), className), ...props }, children);
};
