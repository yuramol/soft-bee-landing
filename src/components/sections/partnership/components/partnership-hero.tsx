import { ComponentContainer } from '@/components/layout';
import { Typography } from '@/components/ui/typography';
import PartnerLink from './partner-link';
import PartnershipWorkflow from './partnership-workflow';
import content from '../partnership.json';

export default function PartnershipHero() {
  const { hero } = content;

  return (
    <section className='hero panel px-4 py-12 md:px-10 md:py-24' aria-labelledby='hero-title'>
      <ComponentContainer className='hero-layout'>
        <div className='hero-copy'>
          <Typography variant='body3' className='eyebrow' tag='p'>
            {hero.eyebrow}
          </Typography>
          <Typography variant='h1' id='hero-title'>
            {hero.titleLine1}
            <br />
            <Typography variant='h1' tag='span'>
              {hero.titleLine2}
            </Typography>
          </Typography>
          <Typography variant='body2' className='hero-description' tag='p'>
            {hero.description}
          </Typography>
          <div className='hero-actions'>
            <PartnerLink>{hero.actions.primary}</PartnerLink>
            <a className='text-link' href='#how-it-works'>
              {hero.actions.secondary}
            </a>
          </div>
        </div>
        <PartnershipWorkflow />
        <div className='capability-strip relative' aria-label='Engineering capabilities'>
          {hero.capabilities.map((capability, idx) => (
            <Typography key={idx} variant='body3' tag='span'>
              {capability}
            </Typography>
          ))}
        </div>
      </ComponentContainer>
    </section>
  );
}
