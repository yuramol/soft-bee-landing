import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

import { ToolsWave } from './components';

export interface ToolsProps {
  title?: string;
}

export function Tools({ title }: ToolsProps) {
  return (
    <section className={cn('flex w-full flex-col pt-8.25', 'lg:pt-45 lg:pb-64.75', 'xl:h-screen xl:overflow-hidden xl:pt-12 xl:pb-16')}>
      <div className='w-full md:mb-10 xl:mb-0 xl:flex xl:min-h-0 xl:flex-1 xl:flex-col xl:justify-center'>
        <ToolsWave />
      </div>
      <div className='px-4 md:px-5 xl:shrink-0'>
        <div className={cn('flex flex-col items-start pb-25.75 text-left', 'lg:items-center lg:pb-0 lg:text-center')}>
          <Badge title='Tools' className='mb-7.5 w-fit lg:mb-10' />
          {title ? (
            <Typography variant='h2' className='text-foreground lg:max-w-175 xl:max-w-331'>
              <span dangerouslySetInnerHTML={{ __html: title }} />
            </Typography>
          ) : (
            <Typography variant='h2' className='text-foreground lg:max-w-175 xl:max-w-331'>
              We don&apos;t chase trends — we choose technologies{' '}
              <span className='text-foreground/50'>
                with a track record. Our stack is stable enough to trust in healthcare and fintech, and flexible enough to grow with your
                product.
              </span>
            </Typography>
          )}
        </div>
      </div>
    </section>
  );
}
