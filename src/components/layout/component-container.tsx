import { FC, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
  className?: string;
}

export const ComponentContainer: FC<Props> = ({ children, className }) => (
  <div className={cn('mx-auto w-full max-w-459 px-1.25 md:px-2.5', className)}>{children}</div>
);
