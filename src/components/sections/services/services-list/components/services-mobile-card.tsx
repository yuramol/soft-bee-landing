import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import { Typography } from '@/components/ui/typography';
import { DiscussProjectButton } from '@/components/discuss-project-button';
import { cn } from '@/lib/utils';

import type { Service } from '../types';

interface ServicesMobileCardProps {
  service: Service;
}

export function ServicesMobileCard({ service }: ServicesMobileCardProps) {
  return (
    <div className='sticky top-0 w-full'>
      <div
        className={cn(
          'relative mb-2 flex min-h-dvh flex-col overflow-hidden rounded-2xl pt-[clamp(20px,calc(100dvh-620px),80px)] pb-7.5 max-[415px]:pt-7.5',
          service.bgClass
        )}
      >
        <div className='px-4'>
          <Typography variant='h2' className={cn('mb-2.5', service.textClass)}>
            {service.title}
          </Typography>
          <Typography variant='body1' className={cn('mb-16.5 opacity-90 max-[415px]:mb-0', service.textClass)}>
            {service.description}
          </Typography>
        </div>

        <div className='mt-auto pt-7.5 max-[415px]:pt-3.75'>
          <div className='mb-3.5 pl-4'>
            <Swiper slidesPerView='auto' spaceBetween={10} loop={true} className='w-full'>
              {service.articles.map((article, idx) => (
                <SwiperSlide key={idx} className='w-90! max-[415px]:w-[85vw]!'>
                  <Link href={service.articles[0].link} className='flex flex-col gap-2'>
                    <div className='relative h-73 w-full overflow-hidden rounded-xl max-[415px]:aspect-360/292 max-[415px]:h-auto'>
                      <Image src={article.image} alt={service.articles[0].title} fill className='object-cover' />
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className='px-4'>
            <div className='mb-1.75 flex justify-between'>
              <Typography variant='description' className={cn(service.textClass)}>
                {service.articles[0].tag}
              </Typography>
              <Typography variant='description' className={cn(service.textClass)}>
                {service.articles[0].readTime}
              </Typography>
            </div>
            <Link href={service.articles[0].link} className='mb-7 block'>
              <Typography variant='body2' className={cn('font-medium', service.textClass)}>
                {service.articles[0].title}
              </Typography>
            </Link>
            <DiscussProjectButton variant='white' className='w-full rounded-full font-medium' text='Discuss project' />
          </div>
        </div>
      </div>
    </div>
  );
}
