import { ComponentContainer } from '@/components/layout';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/typography';
import content from '../partnership.json';

export default function PartnershipHowItWorks() {
  const { howItWorks } = content;

  return (
    <section id='how-it-works' className='process-section px-4 py-12 md:px-10 md:py-24' aria-labelledby='process-title'>
      <ComponentContainer>
        <Badge title={howItWorks.badge} className='mb-6 w-fit' />
        <Typography variant='h2' id='process-title'>
          {howItWorks.titleLine1}
          <br />
          <Typography variant='h2' tag='span' className='muted-text'>
            {howItWorks.titleLine2}
          </Typography>
        </Typography>
        <ol className='steps-grid'>
          {howItWorks.steps.map((step, index) => (
            <li key={step.title}>
              <div className='step-track'>
                <Typography variant='caption' tag='span' className='step-number'>
                  0{index + 1}
                </Typography>
                <span className='step-line' aria-hidden='true' />
              </div>
              <Typography variant='h4'>{step.title}</Typography>
              <Typography variant='body3' tag='p'>
                {step.description}
              </Typography>
            </li>
          ))}
        </ol>
      </ComponentContainer>
    </section>
  );
}
