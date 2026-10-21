import Link from 'next/link';

import { ComponentContainer } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Typography } from '@/components/ui/typography';
import { ROUTES } from '@/constants/routes';

import content from './content.json';

export function NotFound() {
  return (
    <section
      data-not-found
      className='relative flex flex-1 flex-col items-center justify-center px-4 pt-36 pb-20 text-center md:pt-48 md:pb-28'
    >
      <ComponentContainer className='flex flex-col items-center justify-center text-center'>
        <h1 className='text-brand-black font-sans text-[110px] leading-none font-bold tracking-tight select-none sm:text-[150px] md:text-[190px] lg:text-[220px]'>
          404
        </h1>

        <Typography variant='h2' className='text-brand-black mt-4 font-bold md:mt-6'>
          {content.title}
        </Typography>

        <Typography variant='body2' className='text-brand-black/60 mt-3 max-w-140 text-center'>
          {content.description}
        </Typography>

        <div className='mt-8 flex w-full max-w-140 flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 md:mt-10'>
          <Button asChild variant='primary' className='text-16 h-15 w-full rounded-full px-8 font-medium sm:w-1/2 md:px-10'>
            <Link href={ROUTES.HOME} className='flex items-center justify-center gap-2.5 font-medium'>
              <Icon icon='ArrowLeft' color='#ffffff' className='size-4' />
              <span>{content.homeCta}</span>
            </Link>
          </Button>
          <Button
            asChild
            variant='white'
            className='text-16 border-brand-black/10 hover:bg-muted h-15 w-full rounded-full border px-8 font-medium sm:w-1/2 md:px-10'
          >
            <Link href={ROUTES.PARTNERSHIP} className='text-brand-black flex items-center justify-center gap-2.5 font-medium'>
              <span>{content.contactCta}</span>
              <Icon icon='ArrowRight' color='#1B1C23' className='size-4' />
            </Link>
          </Button>
        </div>
      </ComponentContainer>
    </section>
  );
}
