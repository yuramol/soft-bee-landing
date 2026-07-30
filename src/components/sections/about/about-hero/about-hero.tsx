import Image from 'next/image';

import { ComponentContainer } from '@/components/layout/component-container';
import { Typography } from '@/components/ui/typography';

export const AboutHero = () => (
  <section className='relative min-h-dvh w-full overflow-hidden rounded-2xl'>
    <div className='absolute inset-0 z-0'>
      <Image
        src='/images/about/about-team.webp'
        alt='Meet the people behind Soft Bee'
        fill
        priority
        quality={100}
        sizes='100vw'
        className='hidden object-cover object-center md:block'
      />
      <Image
        src='/images/about/about-team-mobile.webp'
        alt='Meet the people behind Soft Bee'
        fill
        priority
        quality={100}
        sizes='100vw'
        className='object-cover object-center md:hidden'
      />
      <div className='absolute inset-0 bg-(image:--hero-gradient)' />
    </div>

    <ComponentContainer className='relative z-10 flex h-full min-h-dvh flex-col justify-end px-5 pb-10.25 lg:flex-row lg:items-end lg:justify-between lg:px-10.5 lg:pb-0'>
      <Typography variant='h1' className='mb-6.75 text-white lg:order-last lg:mb-7 lg:w-1/2 xl:mb-14.25 2xl:mb-28.5'>
        Meet the people
        <br /> behind Soft Bee
      </Typography>

      <Typography variant='body2' className='max-w-84 text-white lg:mb-6.75 xl:mb-13.5 2xl:mb-27'>
        We are a global team of creators, engineers, and problem-solvers who believe that great software starts with great relationships.
      </Typography>
    </ComponentContainer>
  </section>
);
