import Image from 'next/image';

import { Icon } from '@/components/ui/icon';
import { Typography } from '@/components/ui/typography';

interface TestimonialCardProps {
  quote: string;
  avatar: string;
  name: string;
  role: string;
  logo: string;
}

export const TestimonialCard = ({ quote, avatar, name, role, logo }: TestimonialCardProps) => {
  return (
    <div className='group bg-muted relative flex h-auto min-h-93.75 w-full shrink-0 flex-col justify-between overflow-hidden rounded-lg p-6 md:w-149.75 md:max-w-149.75 md:p-8'>
      <div className='card-hover-gradient pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100' />

      <Typography variant='body2' className='relative ml-5 text-[18px] leading-snug'>
        <Icon icon='Quote' color='#00A2BB' className='absolute top-1 -left-4 md:-left-5' />
        {quote}
      </Typography>

      <div className='relative z-10 flex items-center justify-between gap-3 transition-colors duration-500 group-hover:border-transparent'>
        <div className='flex items-center gap-3'>
          <div className='relative size-12.5 shrink-0 overflow-hidden rounded-full bg-gray-200'>
            <Image src={avatar} alt={name} fill className='object-cover' />
          </div>
          <div className='flex flex-col'>
            <Typography variant='body3' className='text-foreground-secondary font-semibold md:font-medium'>
              {name}
            </Typography>
            <Typography variant='body3' className='text-foreground/50'>
              {role}
            </Typography>
          </div>
        </div>
        <div
          className={`relative flex h-11 shrink-0 items-center justify-center overflow-hidden bg-white ${
            logo.includes('trovr') || logo.includes('join-peel') ? 'w-11 rounded-full' : 'w-24 rounded-xl'
          }`}
        >
          <div className={`relative flex h-full w-full items-center justify-center ${logo.includes('confyde') ? 'scale-[1.5]' : ''}`}>
            <Image
              src={logo}
              alt='Company Logo'
              fill
              className={logo.includes('trovr') || logo.includes('join-peel') ? 'object-cover' : 'object-contain'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
