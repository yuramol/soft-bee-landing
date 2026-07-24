import Image from 'next/image';
import Link from 'next/link';

import { Typography } from '@/components/ui/typography';

interface TestimonialCardProps {
  quote: string;
  avatar: string;
  name: string;
  role: string;
  logo: string;
  link: string;
}

export const TestimonialCard = ({ quote, avatar, name, role, logo, link }: TestimonialCardProps) => {
  return (
    <Link
      href={link}
      target='_blank'
      rel='noopener noreferrer'
      className='group bg-muted relative flex h-auto min-h-93.75 w-full shrink-0 flex-col justify-between overflow-hidden rounded-lg p-6 md:w-149.75 md:max-w-149.75 md:p-8'
    >
      <div className='pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100'>
        <Image src='/backgrounds/card-gradient.webp' alt='Hover background' fill className='object-cover' quality={100} />
      </div>

      <Typography
        variant='body2'
        className='before:font-instrument before:text-accent relative ml-5 text-[18px] leading-snug before:absolute before:top-1 before:-left-4 before:text-[28px] before:leading-none before:font-bold before:content-["\201C"] md:before:-left-5'
      >
        {quote}
      </Typography>

      <div className='relative z-10 flex items-center justify-between transition-colors duration-500 group-hover:border-transparent'>
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
        <div className='relative h-8 w-20 shrink-0'>
          <Image src={logo} alt='Company Logo' fill className='object-contain object-right' />
        </div>
      </div>
    </Link>
  );
};
