import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

export interface AwardItemBadge {
  icon: ReactNode;
  label: string;
}

const DEFAULT_BADGES: AwardItemBadge[] = [
  {
    icon: <Icon icon='Crown' className='size-7 shrink-0 lg:size-10.5' />,
    label: '100% Job Success'
  },
  {
    icon: <Image src='/images/home/star-plus.png' alt='Star Plus' width={40} height={40} className='size-7 shrink-0 lg:size-10.5' />,
    label: 'Top Rated Plus'
  }
];

export interface AwardsItemProps {
  logo: ReactNode;
  description: string;
  profileUrl?: string;
  badges?: AwardItemBadge[];
  className?: string;
}

export function AwardsItem({ logo, description, profileUrl, badges = DEFAULT_BADGES, className }: AwardsItemProps) {
  return (
    <Link href={profileUrl ?? ''} target='_blank' rel='noopener noreferrer'>
      <Card
        className={cn(
          'bg-background flex w-full max-w-full flex-col gap-y-21 rounded-[16px] border-0 p-4 md:max-w-150 lg:gap-y-52.5 lg:p-8',
          className
        )}
      >
        <div data-slot='award-header' className='flex items-center justify-between gap-4'>
          <div className='shrink-0'>{logo}</div>
          <Icon icon='Stars' className='h-4.5 w-auto shrink-0 lg:h-7.5' />
        </div>

        <div className='flex flex-col gap-5.5'>
          <Typography variant='body3' className='text-foreground-secondary'>
            {description}
          </Typography>

          <div className='flex flex-wrap items-center gap-3 lg:gap-x-6'>
            {badges.map((badge) => (
              <AwardItemBadge key={badge.label} icon={badge.icon} label={badge.label} />
            ))}
          </div>
        </div>
      </Card>
    </Link>
  );
}

function AwardItemBadge({ icon, label }: AwardItemBadge) {
  return (
    <div className='flex items-center gap-2'>
      {icon}
      <Typography variant='body3' className='text-foreground text-16 md:text-18'>
        {label}
      </Typography>
    </div>
  );
}
