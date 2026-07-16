import { Typography } from '@/components/ui/typography';

import { TypingTitle, TypingSegment } from './typing-title';

const heroTitleSegments: TypingSegment[] = [
  { text: 'Custom', className: 'text-foreground/50', breakAfter: true },
  { text: 'Engineering crafted for ambitious business' }
];

const Hero = () => {
  return (
    <section className="min-h-[560px] bg-background rounded-[36px] pb-[108px] flex justify-between items-end px-[42px] w-full">
      <Typography variant='body2' className='max-w-[336px]'>
        Softbee brings together engineers, designers, and analysts to create dependable solutions.
      </Typography>
      <TypingTitle segments={heroTitleSegments} />
    </section>
  )
}

export default Hero
