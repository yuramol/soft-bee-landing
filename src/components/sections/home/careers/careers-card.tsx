import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Typography } from '@/components/ui/typography';
import { ROUTES } from '@/constants';

interface CareersCardProps {
  badge: string;
  title: string;
  description: string;
}

export const CareersCard = ({ badge, title, description }: CareersCardProps) => {
  return (
    <Link
      href={ROUTES.CAREERS}
      className='group bg-muted relative flex h-auto min-h-93.75 w-full shrink-0 flex-col justify-between overflow-hidden rounded-lg p-4 md:max-w-100 md:min-w-112.75 md:p-8'
    >
      <div className='pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100'>
        <Image src='/backgrounds/card-gradient.webp' alt='Hover background' fill className='object-cover' quality={100} />
      </div>

      <div className='absolute top-8 right-8 z-10'>
        <Button variant='icon' size='icon-md' className='pointer-events-none rounded-full' asChild>
          <span>
            <Icon icon='ArrowUpRight' width={23} height={23} />
          </span>
        </Button>
      </div>

      <div className='bg-foreground-secondary/4 relative z-10 w-fit rounded-sm px-3.5 py-[12.5px]'>
        <Typography variant='h6' className='font-medium md:font-normal'>
          {badge}
        </Typography>
      </div>

      <div className='relative z-10 space-y-4.25'>
        <Typography variant='h4' className='text-[24px] leading-[1.24] font-medium'>
          {title}
        </Typography>
        <Typography variant='body3' className='text-foreground-secondary'>
          {description}
        </Typography>
      </div>
    </Link>
  );
};
