import { getImageProps } from 'next/image';
import { preload } from 'react-dom';

import { ComponentContainer } from '@/components/layout/component-container';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

export function AboutHero() {
  const common = {
    alt: 'Meet the people behind Soft Bee',
    fill: true,
    quality: 75,
    sizes: '100vw',
    className: 'object-cover object-center'
  };

  const {
    props: { srcSet: desktop, src: desktopSrc }
  } = getImageProps({
    ...common,
    src: '/images/about/about-team.webp'
  });

  const {
    props: { srcSet: mobile, src: mobileSrc, alt, ...rest }
  } = getImageProps({
    ...common,
    src: '/images/about/about-team-mobile.webp'
  });

  preload(mobileSrc, {
    as: 'image',
    imageSrcSet: mobile,
    imageSizes: '100vw',
    media: '(max-width: 767px)',
    fetchPriority: 'high'
  });

  preload(desktopSrc, {
    as: 'image',
    imageSrcSet: desktop,
    imageSizes: '100vw',
    media: '(min-width: 768px)'
  });

  return (
    <section className={cn('relative h-[calc(100vh-10px)] w-full overflow-hidden rounded-2xl', 'md:h-[calc(100vh-20px)]')}>
      <div className='absolute inset-0 z-0'>
        <picture>
          <source media='(min-width: 768px)' srcSet={desktop} />
          <source media='(max-width: 767px)' srcSet={mobile} />
          <img alt={alt} {...rest} fetchPriority='high' loading='eager' decoding='sync' />
        </picture>
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
}
