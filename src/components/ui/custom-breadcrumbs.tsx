import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItemProps {
  label: string;
  href?: string;
  isActive?: boolean;
}

export interface CustomBreadcrumbsProps {
  items: BreadcrumbItemProps[];
  className?: string;
}

export function CustomBreadcrumbs({ items, className }: CustomBreadcrumbsProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className='flex items-center gap-3'>
            {item.href && !item.isActive ? (
              <Link href={item.href} className='text-20 text-foreground/50 hover:text-foreground font-normal transition-colors'>
                {item.label}
              </Link>
            ) : (
              <span className='text-20 text-foreground font-medium'>{item.label}</span>
            )}

            {!isLast && <ChevronRight className='text-foreground/50 h-6 w-6' />}
          </div>
        );
      })}
    </div>
  );
}
