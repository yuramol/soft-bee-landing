import { Typography } from '@/components/ui/typography';

import { TypingSegment, TypingTitle } from './typing-title';

const heroTitleSegments: TypingSegment[] = [
  { text: 'Custom', className: 'text-foreground/50', breakAfter: true },
  { text: 'Engineering crafted for ambitious business' }
];

const Hero = () => {
  return (
    <section className='bg-background flex min-h-[560px] w-full items-end justify-between rounded-[36px] px-[42px] pb-[108px]'>
      <Typography variant='body2' className='max-w-[336px]'>
        Softbee brings together engineers, designers, and analysts to create dependable solutions.
      </Typography>
      <TypingTitle segments={heroTitleSegments} />
    </section>
  );
};

export default Hero;
