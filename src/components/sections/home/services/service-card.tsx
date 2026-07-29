import Image from 'next/image';
import Link from 'next/link';

import { Icon } from '@/components/ui/icon';
import { Typography } from '@/components/ui/typography';
import { ROUTES } from '@/constants';

interface ServiceCardProps {
  title: string;
  description: string;
}

export const ServiceCard = ({ title, description }: ServiceCardProps) => {
  return (
    <Link
      href={ROUTES.SERVICES}
      className='group bg-muted relative flex h-93.75 w-full shrink-0 flex-col overflow-hidden rounded-lg p-8 md:h-auto md:max-w-100 md:min-w-112.75'
    >
      <div className='pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100'>
        <Image src='/backgrounds/card-gradient.webp' alt='Hover background' fill className='object-cover' quality={100} />
      </div>

      <div className='relative z-10 mb-34.75 flex size-12.5 items-center justify-center rounded-[8px] bg-[#8A8A8A17] shadow-[0px_1.39px_2.78px_0px_rgba(0,0,0,0.1)] md:bg-white'>
        <Icon icon='SidebarTop' />
      </div>

      <div className='relative z-10'>
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
