import { ReactNode } from 'react';

import { ComponentContainer } from '@/components/layout';
import { cn } from '@/lib/utils';

import { HeroMedusaeBackground } from './components/hero-medusae-background';
import { TypingSegment, TypingTitle } from './components/typing-title';
import heroContent from './content.json';

export interface HeroProps {
  titleSegments?: TypingSegment[];
  description?: ReactNode;
}

export function Hero({ titleSegments = heroContent.titleSegments, description = heroContent.description }: HeroProps) {
  return (
    <HeroMedusaeBackground>
      <ComponentContainer
        className={cn(
          'pointer-events-none relative z-10 flex w-full flex-col-reverse gap-6.75',
          'xl:flex-row xl:items-end xl:justify-between'
        )}
      >
        <p className='text-20 max-w-84 leading-[1.37]'>{description}</p>
        <TypingTitle segments={titleSegments} />
      </ComponentContainer>
    </HeroMedusaeBackground>
  );
}
