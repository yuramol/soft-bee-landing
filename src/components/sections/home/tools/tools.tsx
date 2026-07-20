import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

import { ToolsWave } from './components';

export function Tools() {
  return (
    <section className={cn('flex w-full flex-col', 'lg:pt-45 lg:pb-64.75')}>
      <div className='w-full md:mb-10'>
        <ToolsWave />
      </div>
      <div className='px-4 md:px-5'>
        <div className={cn('flex flex-col items-start pb-25.75 text-left', 'lg:items-center lg:pb-0 lg:text-center')}>
          <Badge title='Tools' className='mb-7.5 w-fit lg:mb-10' />
          <Typography variant='h2' className='text-foreground lg:max-w-175 xl:max-w-331'>
            We choose technologies{' '}
            <span className='text-foreground/50'>
              that shape the future. Our stack combines rock-solid stability with innovative agility, enabling us to build solutions that
              adapt to your business evolution and stand the test of time.
            </span>
          </Typography>
        </div>
      </div>
    </section>
  );
}
