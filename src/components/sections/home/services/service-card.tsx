import Image from 'next/image';
import Link from 'next/link';

import { Icon, IconName } from '@/components/ui/icon';
import { Typography } from '@/components/ui/typography';
import { ROUTES } from '@/constants';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: IconName;
}

export const ServiceCard = ({ title, description, icon }: ServiceCardProps) => {
  return (
    <Link
      href={ROUTES.SERVICES}
      className='group bg-muted relative flex h-full w-full shrink-0 flex-col overflow-hidden rounded-lg p-8 md:max-w-100 md:min-w-112.75'
    >
      <div className='pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100'>
        <Image src='/backgrounds/card-gradient.webp' alt='Hover background' fill className='object-cover' quality={100} />
      </div>

      <div className='relative z-10 mb-auto flex size-24 items-center justify-center rounded-2xl bg-[#8A8A8A17] shadow-sm md:bg-white'>
        <Icon icon={icon} size={48} className='text-foreground' />
      </div>

      <div className='relative z-10 mt-10'>
        <Typography variant='h4' className='mb-4.25 text-[24px] leading-[1.24] font-medium'>
          {title}
        </Typography>

        <Typography variant='body3' className='text-foreground-secondary text-[18px] leading-snug'>
          {description}
        </Typography>
      </div>
    </Link>
  );
};

export const ViewMoreServiceCard = () => {
  return (
    <Link
      href={ROUTES.SERVICES}
      className='group bg-muted relative flex h-full w-full shrink-0 flex-col items-center justify-center overflow-hidden rounded-lg p-8 md:max-w-100 md:min-w-112.75'
    >
      <div className='pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100'>
        <Image src='/backgrounds/card-gradient.webp' alt='Hover background' fill className='object-cover' quality={100} />
      </div>

      <div className='relative z-10 flex flex-col items-center gap-6 transition-transform duration-300 group-hover:-translate-y-2'>
        <div className='flex size-16 items-center justify-center rounded-full bg-white shadow-[0px_2px_8px_rgba(0,0,0,0.08)]'>
          <Icon icon='ArrowUpRight' width={32} height={32} />
        </div>
        <Typography variant='h4' className='text-[24px] font-medium'>
          View all services
        </Typography>
      </div>
    </Link>
  );
};
