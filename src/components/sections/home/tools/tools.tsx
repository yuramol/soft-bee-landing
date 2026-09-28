import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

import { CaseStudyTool } from '../../case-studies/data';
import { ToolsWave } from './components';
import toolsContent from './content.json';

export interface ToolsProps {
  title?: string;
  tools?: CaseStudyTool[];
}

export function Tools({ title, tools }: ToolsProps) {
  return (
    <section className={cn('flex w-full flex-col pt-8.25', 'xl:h-screen xl:overflow-hidden xl:pt-6 xl:pb-10')}>
      <div className='w-full xl:flex xl:min-h-0 xl:flex-1 xl:flex-col xl:justify-center'>
        <ToolsWave tools={tools} />
      </div>
      <div className='px-4 md:px-5 xl:shrink-0'>
        <div className={cn('flex flex-col items-start pb-10 text-left', 'lg:items-center lg:pb-30 lg:text-center')}>
          <Badge title={toolsContent.badge} className='mb-7.5 w-fit lg:mb-10' />
          {title ? (
            <Typography variant='h2' className='text-foreground lg:max-w-175 xl:max-w-331'>
              <span dangerouslySetInnerHTML={{ __html: title }} />
            </Typography>
          ) : (
            <Typography variant='h2' className='text-foreground lg:max-w-175 xl:max-w-331'>
              {toolsContent.title.map((segment, index) =>
                segment.className ? (
                  <span key={index} className={segment.className}>
                    {segment.text}
                  </span>
                ) : (
                  <span key={index}>{segment.text}</span>
                )
              )}
            </Typography>
          )}
        </div>
      </div>
    </section>
  );
}
