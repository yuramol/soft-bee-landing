'use client';

import Link from 'next/link';

import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { ComponentContainer } from '@/components/layout';
import { DiscussProjectButton } from '@/components/discuss-project-button';

import { DeferredImage } from './deferred-image';
import type { Service } from '../types';

interface DesktopCardProps {
  service: Service;
  index: number;
  allServices: Service[];
  ctaText: string;
}

const PROJECT_IMAGE_SIZES = '(max-width: 1279px) 20rem, (max-width: 1535px) 23rem, 28rem';

function scrollToService(id: string) {
  const anchor = document.getElementById(`service-anchor-${id}`);
  if (anchor) {
    const top = anchor.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top,
      behavior: 'auto'
    });
  }
}

export function ServicesDesktopCard({ service, index, allServices, ctaText }: DesktopCardProps) {
  const projectClassName = 'group ml-auto flex flex-col items-start';

  const projectContent = (
    <>
      <div className='flex gap-2'>
        {service.project.images.map((imgSrc, idx) => (
          <div
            key={idx}
            className='relative h-40 w-52 shrink-0 overflow-hidden rounded-xl lg:h-65 lg:w-78 xl:h-93.75 xl:w-111.75 xl:rounded-2xl'
          >
            <DeferredImage
              src={imgSrc}
              alt={service.project.title}
              sizes={PROJECT_IMAGE_SIZES}
              className='object-cover transition-transform duration-500 group-hover:scale-105'
            />
          </div>
        ))}
      </div>

      <div className='mt-3.5'>
        <Typography variant='body1' className={cn('font-medium', service.textClass)}>
          {service.project.title}
        </Typography>
      </div>
    </>
  );

  return (
    <>
      <div id={`service-anchor-${service.id}`} className='block h-0 w-full' />
      <div
        id={`service-card-${service.id}`}
        className={cn('sticky top-0 flex min-h-svh w-full overflow-x-hidden overflow-y-auto rounded-[36px]', service.bgClass)}
        style={{ zIndex: 10 + index }}
      >
        <ComponentContainer className='flex min-h-svh w-full flex-col justify-between gap-8 p-6 pb-10.75 lg:gap-12 lg:p-10.5 xl:gap-20 xl:pb-21.5 2xl:gap-30'>
          <div className='flex w-full items-start justify-between gap-4'>
            <div className='flex flex-col gap-1.5'>
              {allServices.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollToService(s.id)}
                  className='group cursor-pointer text-left transition-opacity'
                  type='button'
                >
                  <Typography
                    variant='body1'
                    className={cn(
                      'text-[20px] transition-opacity duration-300',
                      service.textClass,
                      s.id === service.id ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'
                    )}
                  >
                    {s.title}
                  </Typography>
                </button>
              ))}
            </div>

            {service.project.link ? (
              <Link href={service.project.link} className={projectClassName}>
                {projectContent}
              </Link>
            ) : (
              <div className={projectClassName}>{projectContent}</div>
            )}
          </div>

          <div className='flex w-full items-start justify-between gap-4 lg:pb-5'>
            <div className='flex w-1/2 shrink-0 flex-col items-start gap-6 pr-4 lg:pr-8'>
              <Typography variant='h2' className={cn('max-w-116.25', service.textClass)}>
                {service.title}
              </Typography>
              <DiscussProjectButton className='w-75' variant='white' text={ctaText} />
            </div>

            <div className='flex w-1/2 min-w-0 flex-col items-start'>
              <Typography variant='body2' className={cn('w-full max-w-167', service.textClass)}>
                {service.description}
              </Typography>
            </div>
          </div>
        </ComponentContainer>
      </div>
    </>
  );
}
