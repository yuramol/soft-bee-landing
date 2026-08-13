import Image from 'next/image';
import Link from 'next/link';

import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { ComponentContainer } from '@/components/layout';

import type { Service } from '../types';

interface DesktopCardProps {
  service: Service;
  index: number;
  allServices: Service[];
}

export function ServicesDesktopCard({ service, index, allServices }: DesktopCardProps) {
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

  return (
    <>
      <div id={`service-anchor-${service.id}`} className='block h-0 w-full' />
      <div
        id={`service-card-${service.id}`}
        className={cn('sticky top-0 flex h-screen w-full overflow-hidden rounded-[36px]', service.bgClass)}
        style={{ zIndex: 10 + index }}
      >
        <ComponentContainer className='relative h-full w-full'>
          {/* Top Left Menu */}
          <div className='absolute top-10.5 left-10.5 flex flex-col gap-1.5'>
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

          {/* Top Right Articles */}
          <Link
            href={service.articles[0].link}
            className={cn('group absolute top-10.5 flex flex-col', service.articles.length > 1 ? 'left-1/2' : 'right-10.5 w-111.75')}
          >
            <div
              className={cn(
                'overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
                service.articles.length > 1 ? 'w-[50vw]' : 'w-auto'
              )}
            >
              <div className={cn('flex gap-2', service.articles.length > 1 ? 'w-max pr-10.5' : 'w-full')}>
                {service.articles.map((article, idx) => (
                  <div key={idx} className='relative h-93.75 w-111.75 shrink-0 overflow-hidden rounded-2xl'>
                    <Image
                      src={article.image}
                      alt={service.articles[0].title}
                      fill
                      className='object-cover transition-transform duration-500 group-hover:scale-105'
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className='mt-3.5 w-111.75'>
              <div className='mb-1.75 flex justify-between'>
                <Typography variant='description' className={cn(service.textClass)}>
                  {service.articles[0].tag}
                </Typography>
                <Typography variant='description' className={cn(service.textClass)}>
                  {service.articles[0].readTime}
                </Typography>
              </div>
              <Typography variant='body1' className={cn('font-medium', service.textClass)}>
                {service.articles[0].title}
              </Typography>
            </div>
          </Link>

          {/* Bottom Left Title */}
          <div className='absolute bottom-14.5 left-10.5 xl:bottom-29'>
            <Typography variant='h2' className={cn('max-w-116.25', service.textClass)}>
              {service.title}
            </Typography>
          </div>

          {/* Bottom Description */}
          <div className='absolute bottom-10.75 left-1/2 xl:bottom-21.5'>
            <Typography variant='body2' className={cn('max-w-167 pr-10.5', service.textClass)}>
              {service.description}
            </Typography>
          </div>
        </ComponentContainer>
      </div>
    </>
  );
}
