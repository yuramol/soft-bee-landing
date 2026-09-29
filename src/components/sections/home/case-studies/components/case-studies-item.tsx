import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

export interface CaseStudyItemData {
  title: string;
  description: string;
  tools: string[];
  image: string;
}

interface CaseStudiesItemProps {
  item: CaseStudyItemData;
}

function CaseStudiesItem({ item }: CaseStudiesItemProps) {
  const { title, description, tools, image } = item;

  return (
    <div className={cn('flex flex-col-reverse items-center gap-x-5 gap-y-7', 'lg:flex-row 2xl:gap-x-45')}>
      <div className='flex flex-col gap-y-3 px-4 lg:gap-y-11.5 lg:px-10.5'>
        <Typography variant='h2'>{title}</Typography>
        <Typography variant='body2'>{description}</Typography>
        <div className='mt-3 flex flex-wrap gap-2 lg:mt-0'>
          {tools.map((tool) => (
            <Badge key={tool} className='text-18!'>
              {tool}
            </Badge>
          ))}
        </div>
      </div>
      <div className='lg:max-w-auto relative w-145 max-w-full lg:min-w-1/2'>
        <Image
          src={image}
          alt={title}
          width={945}
          height={684}
          sizes='(min-width: 1024px) 50vw, 100vw'
          quality={75}
          className='w-full rounded-2xl'
        />
      </div>
    </div>
  );
}

export default CaseStudiesItem;
