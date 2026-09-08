import Image from 'next/image';
import { ComponentContainer } from '@/components/layout';

interface ArticlePreviewProps {
  image: string;
  title: string;
}

export function ArticlePreview({ image, title }: ArticlePreviewProps) {
  return (
    <section>
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
}
