import { cva, VariantProps } from 'class-variance-authority';
import React, { FC, HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';
import { Label, LabelProps } from '@ui/label';
import { Typography, TypographyProps } from '@ui/typography';

const detailItemVariants = cva('gap-1.5', {
  variants: {
    oriantation: {
      horizontal: 'flex items-center',
      vertical: 'flex flex-col'
    }
  },
  defaultVariants: {
    oriantation: 'vertical'
  }
});

type DetailItemProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof detailItemVariants>;

const DetailItem: FC<DetailItemProps> = ({ className, oriantation, ...restProps }) => {
  return <div {...restProps} className={cn(detailItemVariants({ oriantation }), className)} />;
};
DetailItem.displayName = 'DetailItem';

type DetailItemTextsProps = DetailItemProps;

const DetailItemTexts: FC<DetailItemTextsProps> = ({ className, oriantation, ...restProps }) => {
  return <div {...restProps} className={cn(detailItemVariants({ oriantation }), 'gap-0', className)} />;
};
DetailItemTexts.displayName = 'DetailItemTexts';

type DetailItemLabelProps = LabelProps;

const DetailItemLabel: React.FC<DetailItemLabelProps> = (props) => {
  return <Label {...props} variant='secondary' />;
};
DetailItemLabel.displayName = 'DetailItemLabel';

type DetailItemTextProps = Partial<TypographyProps>;

const DetailItemText: FC<DetailItemTextProps> = ({ variant, className, ...retsProps }) => {
  return <Typography {...retsProps} variant={variant ?? 'body3'} className={cn('break-word', className)} />;
};
DetailItemText.displayName = 'DetailItemText';

const DetailItemSubText: FC<Partial<TypographyProps>> = ({ variant, className, ...retsProps }) => {
  return <Typography {...retsProps} variant={variant ?? 'description'} className={cn('text-gray', className)} />;
};
DetailItemSubText.displayName = 'DetailItemSubText';

export {
  type DetailItemProps,
  type DetailItemLabelProps,
  type DetailItemTextProps,
  DetailItem,
  DetailItemTexts,
  DetailItemLabel,
  DetailItemText,
  DetailItemSubText
};
