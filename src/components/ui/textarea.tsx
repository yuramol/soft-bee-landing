import * as React from 'react';

import { cn } from '@/lib/utils';

import { fieldVariant } from './field';
import { inputVariants } from './input';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  variant?: 'primary' | 'secondary';
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, variant = 'primary', ...props }, ref) => {
  return (
    <textarea
      className={cn(variant === 'primary' ? inputVariants() : fieldVariant(), 'max-h-[300px] min-h-[64px] w-full', 'text-body3', className)}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
