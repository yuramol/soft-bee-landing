import { ComponentContainer } from '@/components/layout';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/typography';
import PartnershipForm from './partnership-form';
import content from '../partnership.json';

export default function PartnershipContact() {
  const { contact } = content;

  return (
    <section className='contact-section px-4 py-12 md:px-10 md:py-24' aria-labelledby='contact-title'>
      <ComponentContainer className='contact-layout'>
        <div className='contact-copy'>
          <Badge title={contact.badge} className='mb-6 w-fit' />
          <Typography variant='h2' id='contact-title'>
            {contact.titleLine1}
            <br />
            <Typography variant='h2' tag='span' className='muted-text'>
              {contact.titleLine2}
            </Typography>
          </Typography>
          <Typography variant='body2' className='contact-description' tag='p'>
            {contact.description}
          </Typography>
          <div className='faq-list' aria-label='Partnership questions'>
            {contact.questions.map((q) => (
              <details key={q.question}>
                <summary>
                  <Typography variant='h4'>{q.question}</Typography>
                  <span className='disclosure-icon' aria-hidden='true' />
                </summary>
                <Typography variant='body3' tag='p'>
                  {q.answer}
                </Typography>
              </details>
            ))}
          </div>
        </div>
        <PartnershipForm />
      </ComponentContainer>
    </section>
  );
}
