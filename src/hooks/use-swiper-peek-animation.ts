import { useEffect } from 'react';
import type { Swiper as SwiperClass } from 'swiper';
import { BREAKPOINTS } from '@/constants';

export function useSwiperPeekAnimation(swiperInstance: SwiperClass | null, maxWidth: number = BREAKPOINTS.MD) {
  useEffect(() => {
    let hasAnimated = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasAnimated && window.innerWidth < maxWidth) {
              hasAnimated = true;
              if (swiperInstance && swiperInstance.wrapperEl) {
                // Autoplay sliding mid-peek would be undone by the final setTranslate, so pause it until the peek ends.
                const shouldResumeAutoplay = Boolean(swiperInstance.autoplay?.running);
                if (shouldResumeAutoplay) swiperInstance.autoplay.stop();

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
                      if (shouldResumeAutoplay && !swiperInstance.destroyed) swiperInstance.autoplay.start();
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
  }, [swiperInstance, maxWidth]);
}
