import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

import type { CaseStudiesItem as CaseStudiesItemData } from '../data';
interface CaseStudiesItemProps {
  item: CaseStudiesItemData;
}

function CaseStudiesItem({ item }: CaseStudiesItemProps) {
  const { title, description, tools, image, href } = item;
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
      <Link href={href} className='lg:max-w-auto relative w-145 max-w-full lg:min-w-1/2'>
        <Image src={image} alt={title} width={945} height={684} className='w-full rounded-2xl' />
        <Button
          variant='icon'
          size='icon-md'
          className='text-foreground lg:bg-foreground pointer-events-none absolute right-2 bottom-2 bg-white lg:right-12.5 lg:bottom-12.5 lg:text-white'
        >
          <Icon icon='ArrowUpRight' className='size-4.5' />
        </Button>
      </Link>
    </div>
  );
}

export default CaseStudiesItem;
