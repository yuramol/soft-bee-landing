import Image from 'next/image';
import { ComponentContainer } from '@/components/layout';

interface CaseStudyPreviewProps {
  image: string;
  title: string;
}

export const CaseStudyPreview = ({ image, title }: CaseStudyPreviewProps) => (
  <section className='my-2.5 lg:my-8'>
    <ComponentContainer>
      <Image
        src={image}
        alt={`${title} preview`}
        width={1440}
        height={900}
        className='h-auto w-full rounded-md object-cover lg:h-dvh lg:rounded-4xl'
      />
    </ComponentContainer>
  </section>
);
