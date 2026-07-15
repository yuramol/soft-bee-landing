import { cva, VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import * as React from 'react';

import { ButtonHover } from '@/assets/icons/button-hover';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-transparent font-medium whitespace-nowrap outline-none select-none transition-[color,background-color,transform,opacity] duration-150 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-brand-black/30 disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-brand-black text-brand-white shadow-xs hover:bg-brand-black/90',
        primary: 'group relative overflow-hidden border-0 bg-brand-black text-brand-white shadow-xs',
        white: 'bg-brand-white text-brand-black hover:bg-mist-gray',
        icon: 'bg-brand-black text-brand-white hover:bg-brand-black/90'
      },
      size: {
        default: 'h-15 gap-2 px-[28.5px] text-16',
        'icon-md': 'size-[50px] gap-0 p-0',
        'icon-lg': 'size-[62px] gap-0 p-0'
      }
    },
    compoundVariants: [
      {
        variant: 'white',
        size: ['icon-md', 'icon-lg'],
        class: 'bg-mist-gray text-brand-black hover:bg-brand-black hover:text-brand-white'
      }
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface ButtonProps extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

function Button({
  className,
  variant = 'default',
  size = 'default',
  isLoading = false,
  asChild = false,
  leftIcon,
  rightIcon,
  ref,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button';
  const resolvedSize = variant === 'icon' && size === 'default' ? 'icon-md' : size;
  const showHoverBackground = variant === 'primary' && !asChild;

  return (
    <Comp
      data-slot='button'
      data-variant={variant}
      data-size={resolvedSize}
      ref={ref}
      disabled={isLoading || props.disabled}
      className={cn(buttonVariants({ variant, size: resolvedSize }), className)}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {showHoverBackground ? (
            <ButtonHover className='pointer-events-none absolute inset-0 size-full max-h-none max-w-none opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
          ) : null}
          <span className={cn(showHoverBackground ? 'relative z-10 inline-flex items-center justify-center gap-2' : 'contents')}>
            {leftIcon}
            {children}
            {rightIcon}
          </span>
        </>
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
