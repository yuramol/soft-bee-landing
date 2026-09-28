import Image from 'next/image';
import { ComponentContainer } from '@/components/layout';

interface ArticlePreviewProps {
  image: string;
  title: string;
  unoptimized?: boolean;
}

export function ArticlePreview({ image, title, unoptimized = false }: ArticlePreviewProps) {
  return (
    <section>
      <ComponentContainer>
        <Image
          src={image}
          alt={`${title} preview`}
          width={1440}
          height={900}
          unoptimized={unoptimized || isRemoteImage(image)}
          className='h-auto w-full rounded-md object-cover lg:h-dvh lg:rounded-4xl'
        />
      </ComponentContainer>
    </section>
  );
}

function isRemoteImage(src: string): boolean {
  return src.startsWith('http://') || src.startsWith('https://');
}
