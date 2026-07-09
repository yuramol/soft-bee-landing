import { FC } from 'react';

import { cn } from '@/lib/utils';

import { formLabelVariants } from './form';
import { Textarea, TextareaProps } from './textarea';
import { Typography, TypographyProps } from './typography';

type Props = TextareaProps & {
  value: string;
  startLabel: string;
  endLabel?: string;
  startLabelProps?: TypographyProps;
};

export const TextareaInstructions: FC<Props> = ({
  value,
  maxLength = 1000,
  placeholder = 'Please enter special instructions',
  startLabel,
  endLabel,
  readOnly,
  className,
  startLabelProps,
  ...restProps
}) => {
  return (
    <div className='flex flex-col gap-1'>
      <div className='flex items-center justify-between gap-2'>
        <Typography
          variant={startLabelProps?.variant ?? 'description'}
          className={cn((formLabelVariants(), 'text-gray'), startLabelProps?.className)}
          {...startLabelProps}
        >
          {startLabel}
        </Typography>
        {endLabel && (
          <Typography className={(formLabelVariants(), '!text-description text-gray')} variant='description'>
            {endLabel}
          </Typography>
        )}
      </div>
      <Textarea
        value={value || ''}
        maxLength={maxLength}
        placeholder={placeholder}
        readOnly={readOnly}
        className={cn(readOnly && 'cursor-not-allowed resize-none !ring-0', className)}
        {...restProps}
      />
    </div>
  );
};
