'use client';

import 'swiper/css';

import { useEffect, useState } from 'react';
import { Swiper as SwiperClass } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { BREAKPOINTS } from '@/constants';

import { CareersVideoCard } from './careers-video-card';
import careersContent from './content.json';

export const CareersVideo = () => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null);

  useEffect(() => {
    let hasAnimated = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasAnimated && window.innerWidth < BREAKPOINTS.MD) {
              hasAnimated = true;
              if (swiperInstance && swiperInstance.wrapperEl) {
                setTimeout(() => {
                  const wrapper = swiperInstance.wrapperEl;
                  const currentTranslate = swiperInstance.translate;

                  wrapper.style.transition = 'transform 0.6s ease-out';
                  wrapper.style.transform = `translate3d(${currentTranslate - 60}px, 0, 0)`;

                  setTimeout(() => {
                    wrapper.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;
                    setTimeout(() => {
                      wrapper.style.transition = '';
                      swiperInstance.setTranslate(currentTranslate);
                    }, 600);
                  }, 700);
                }, 500);
              }
            }
          } else {
            hasAnimated = false;
          }
        });
      },
      { threshold: 0.8, rootMargin: '0px 0px -10% 0px' }
    );

    if (swiperInstance && swiperInstance.el) {
      observer.observe(swiperInstance.el);
    }
    return () => observer.disconnect();
  }, [swiperInstance]);

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
