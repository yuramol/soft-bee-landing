import Image from 'next/image';
import { ComponentContainer } from '@/components/layout';

interface CaseStudyGalleryProps {
  images?: string[];
}

export const CaseStudyGallery = ({ images }: CaseStudyGalleryProps) => {
  if (!images || images.length !== 3) return null;

  return (
    <section className='mt-9 mb-20 md:mt-50 xl:mb-32'>
      <ComponentContainer>
        <div className='flex flex-col gap-2.5 xl:gap-8.75'>
          <div className='w-full'>
            <Image
              src={images[0]}
              alt='Gallery image 1'
              width={1400}
              height={1020}
              className='aspect-490/539 h-auto w-full rounded-md object-cover xl:aspect-auto xl:h-screen xl:rounded-4xl'
            />
          </div>

          <div className='flex flex-col gap-2.5 xl:flex-row xl:gap-8.75'>
            {images.slice(1).map((img, idx) => (
              <div key={idx} className='w-full xl:flex-1'>
                <Image
                  src={img}
                  alt={`Gallery image ${idx + 2}`}
                  width={680}
                  height={822}
                  className='h-auto w-full rounded-md object-cover xl:h-205.5 xl:rounded-4xl'
                />
              </div>
            ))}
          </div>
        </div>
      </ComponentContainer>
    </section>
  );
};
