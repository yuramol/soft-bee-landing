import Image from 'next/image';
import { ComponentContainer } from '@/components/layout';

interface CaseStudyPreviewProps {
  image: string;
  title: string;
}

export const CaseStudyPreview = ({ image, title }: CaseStudyPreviewProps) => (
  <section className='mb-15 lg:mb-30'>
    <ComponentContainer>
      <Image
        src={image}
        alt={`${title} preview`}
        width={1440}
        height={900}
        className='h-auto w-full rounded-md object-cover lg:rounded-4xl'
      />
    </ComponentContainer>
  </section>
);
