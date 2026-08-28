import { FC, ReactNode } from 'react';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

interface TopicBadgeProps {
  children: ReactNode;
  className?: string;
}

export const TopicBadge: FC<TopicBadgeProps> = ({ children, className }) => (
  <div className='bg-foreground-secondary/4 rounded-full px-3.5 py-1.5'>
    <Typography variant='body3' className={cn('text-foreground font-medium', className)}>
      {children}
    </Typography>
  </div>
);
