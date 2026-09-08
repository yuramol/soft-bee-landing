'use client';

import 'swiper/css';

import { useState } from 'react';
import { Swiper as SwiperClass } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useSwiperPeekAnimation } from '@/hooks/use-swiper-peek-animation';

import { CareersVideoCard } from './careers-video-card';
import careersContent from './content.json';

export const CareersVideo = () => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null);

  useSwiperPeekAnimation(swiperInstance);

  return (
    <div className='w-full px-4 pb-24.5 md:px-5 xl:pt-15 xl:pb-28.75'>
      <div className='hidden md:flex md:w-full md:gap-2.5'>
        {careersContent.videos.map((video) => (
          <CareersVideoCard
            key={video.id}
            title={video.title}
            description={video.description}
            imageSrc={video.imageSrc}
            videoUrl={video.videoUrl}
          />
        ))}
      </div>

      <div className='block overflow-hidden md:hidden'>
        <Swiper loop={true} slidesPerView='auto' spaceBetween={10} className='w-full overflow-visible!' onSwiper={setSwiperInstance}>
          {careersContent.videos.map((video) => (
            <SwiperSlide key={`mobile-video-${video.id}`} className='w-full!'>
              <CareersVideoCard title={video.title} description={video.description} imageSrc={video.imageSrc} videoUrl={video.videoUrl} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
