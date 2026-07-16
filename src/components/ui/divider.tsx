import { FC, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type DividerProps = HTMLAttributes<HTMLDivElement>;

export const Divider: FC<DividerProps> = ({ className, ...props }) => {
  return <div className={cn('bg-brand-black/12 h-px w-full', className)} {...props} />;
};
