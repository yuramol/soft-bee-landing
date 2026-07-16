import * as React from 'react';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { Typography } from './typography';

export interface FileBadgeProps {
  name: string;
  onRemove: (e: React.MouseEvent) => void;
  className?: string;
}

export function FileBadge({ name, onRemove, className }: FileBadgeProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className={cn(
        'border-brand-black/50 bg-mist-gray flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 transition-colors',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onRemove}
    >
      <Typography variant='caption' className='text-brand-black max-w-38 truncate leading-6'>
        {name}
      </Typography>
      <button type='button' className='pointer-events-none flex items-center justify-center outline-none'>
        <Icon icon='X' width={14} height={14} fill={isHovered ? undefined : '#1B1C2380'} />
      </button>
    </div>
  );
}
