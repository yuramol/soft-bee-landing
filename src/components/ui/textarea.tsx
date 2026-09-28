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
      className={cn(
        variant === 'primary' ? inputVariants() : fieldVariant(),
        'h-30 w-full resize-none rounded-3xl py-4 pr-4',
        'text-body3',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
