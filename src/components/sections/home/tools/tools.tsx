import { ComponentContainer } from '@/components/layout';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

import { ToolsWave } from './components';

export function Tools() {
  return (
    <section className={cn('flex w-full flex-col-reverse', 'lg:flex-col lg:pt-47.5 lg:pb-64.75')}>
      <ComponentContainer>
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
      </ComponentContainer>

      <div className='mt-12 w-full lg:mt-20'>
        <ToolsWave />
      </div>
    </section>
  );
}
