import { ComponentContainer } from '@/components/layout';
import { Typography } from '@/components/ui/typography';

interface CaseStudyCardsProps {
  cards: { title: string; description: string }[];
}

export const CaseStudyCards = ({ cards }: CaseStudyCardsProps) => (
  <div className='w-full'>
    <ComponentContainer className='relative z-10'>
      <div className='bg-muted rounded-2xl p-4'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {cards.map((card, index) => (
            <div key={index} className='bg-background rounded-2xl px-6 pt-6 pb-3.25 md:pb-10'>
              <Typography variant='h3' className='text-foreground mb-6 font-semibold'>
                {card.title}
              </Typography>
              <Typography variant='body2' className='text-foreground font-normal'>
                {card.description}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </ComponentContainer>
  </div>
);
