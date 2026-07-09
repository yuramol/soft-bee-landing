'use client';

import { cva, VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';
import * as TabsPrimitive from '@radix-ui/react-tabs';

const Tabs = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Root>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>>(
  ({ className, ...props }, ref) => <TabsPrimitive.Root ref={ref} className={cn(className)} {...props} />
);
Tabs.displayName = TabsPrimitive.Tabs.displayName;

interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  spacing?: boolean;
}

const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(({ className, spacing, ...props }, ref) => (
  <TabsPrimitive.List ref={ref} className={cn('!w-fit', spacing && 'space-x-[30px]', className)} {...props} />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const tabsTriggerVariants = cva(
  'inline-flex h-11 !w-fit items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        none: '',
        default: 'px-5 py-2.5 hover:text-blue data-[state=active]:text-blue',
        primary:
          'rounded-t-[10px] bg-white px-5 py-2.5 text-body1 font-medium text-gray hover:bg-blue-light data-[state=active]:bg-[#EFF1FB] data-[state=active]:text-black',
        secondary:
          '!text-h4 font-normal text-gray underline-offset-4 hover:text-blue data-[state=active]:text-blue data-[state=active]:underline'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & VariantProps<typeof tabsTriggerVariants>
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.Trigger ref={ref} className={cn(tabsTriggerVariants({ variant }), className)} {...props} />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const tabsContentVariants = cva('', {
  variants: {
    variant: {
      default: '',
      primary: 'bg-[#EFF1FB]'
    },
    spacing: {
      default: 'p-3',
      vertical: 'py-3',
      horizontal: 'px-3'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> & VariantProps<typeof tabsContentVariants>
>(({ className, variant, spacing, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(tabsContentVariants({ variant, spacing }), 'data-[state=inactive]:hidden', className)}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
