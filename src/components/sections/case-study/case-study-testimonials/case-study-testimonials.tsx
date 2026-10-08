import { ComponentContainer } from '@/components/layout';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/typography';
import { TestimonialCard } from '@/components/sections/home/testimonials/testimonial-card';
import type { TestimonialItem } from '@/components/sections/home/testimonials/testimonials';
import testimonialsContent from '@/components/sections/home/testimonials/content.json';

interface CaseStudyTestimonialsProps {
  cards?: TestimonialItem[];
}

export const CaseStudyTestimonials = ({ cards = [] }: CaseStudyTestimonialsProps) => {
  if (cards.length === 0) return null;

  return (
    <section className='cv-auto relative z-10 -mb-10 w-full md:-mb-10'>
      <ComponentContainer>
        <div className='w-full overflow-hidden rounded-lg bg-white px-4 py-10 md:rounded-2xl md:px-10.5 md:py-16 lg:py-20 xl:py-28.75'>
          <div className='flex w-full flex-col gap-12 lg:flex-row lg:items-start lg:justify-between'>
            <div className='flex flex-1 flex-col'>
              <Badge
                title={cards.length === 1 ? testimonialsContent.badgeSingular : testimonialsContent.badge}
                className='bg-muted/50 mb-7.5 w-fit md:mb-10'
              />
              <Typography variant='h2' className='text-foreground'>
                {testimonialsContent.title}
              </Typography>
            </div>

            <div className='flex w-full shrink-0 flex-col items-end gap-6 lg:w-150 xl:w-149.75'>
              {cards.map((card) => (
                <div key={card.id} className='flex w-full justify-end'>
                  <TestimonialCard quote={card.quote} avatar={card.avatar} name={card.name} role={card.role} logo={card.logo} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </ComponentContainer>
    </section>
  );
};
