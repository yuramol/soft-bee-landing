import { ComponentContainer } from '@/components/layout';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/typography';
import Image from 'next/image';
import Link from 'next/link';
import content from '../partnership.json';
import { Icon } from '@/components/ui/icon';

export default function PartnershipWhoItsFor() {
  const { whoItsFor } = content;

  return (
    <section className='partners-section px-4 py-12 md:px-10 md:py-24' aria-labelledby='partners-title'>
      <ComponentContainer>
        <div className='section-heading-row'>
          <div>
            <Badge title={whoItsFor.badge} className='mb-6 w-fit' />
            <Typography variant='h2' id='partners-title'>
              {whoItsFor.titleLine1}
              <br />
              <Typography variant='h2' tag='span' className='muted-text'>
                {whoItsFor.titleLine2}
              </Typography>
            </Typography>
          </div>
          <Typography variant='body2' className='section-intro' tag='p'>
            {whoItsFor.intro}
          </Typography>
        </div>
        <div className='partner-grid'>
          <article className='partner-card'>
            <div className='partner-card-top'>
              <Typography variant='caption' tag='span' className='partner-label'>
                {whoItsFor.cards[0].label}
              </Typography>
              <svg width='28' height='28' viewBox='0 0 28 28' fill='none' aria-hidden='true'>
                <rect x='3' y='3' width='22' height='22' rx='3' stroke='currentColor' strokeWidth='1.5' />
                <path d='M3 10h22M10 10v15' stroke='currentColor' strokeWidth='1.5' />
              </svg>
            </div>
            <Typography variant='h3'>
              {whoItsFor.cards[0].titleLine1}
              <br />
              {whoItsFor.cards[0].titleLine2}
            </Typography>
            <Typography variant='body3' tag='p'>
              {whoItsFor.cards[0].description}
            </Typography>
            <div className='role-pair'>
              <span>
                <Typography variant='caption3' tag='span'>
                  You bring
                </Typography>
                <Typography variant='body3' tag='span'>
                  {whoItsFor.cards[0].youBring}
                </Typography>
              </span>
              <span>
                <Typography variant='caption3' tag='span'>
                  We handle
                </Typography>
                <Typography variant='body3' tag='span'>
                  {whoItsFor.cards[0].weHandle}
                </Typography>
              </span>
            </div>
          </article>
          <article className='partner-card'>
            <div className='partner-card-top'>
              <Typography variant='caption' tag='span' className='partner-label'>
                {whoItsFor.cards[1].label}
              </Typography>
              <svg width='28' height='28' viewBox='0 0 28 28' fill='none' aria-hidden='true'>
                <path
                  d='m10 7-7 7 7 7m8-14 7 7-7 7m-2-17-4 20'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
            <Typography variant='h3'>
              {whoItsFor.cards[1].titleLine1}
              <br />
              {whoItsFor.cards[1].titleLine2}
            </Typography>
            <Typography variant='body3' tag='p'>
              {whoItsFor.cards[1].description}
            </Typography>
            <div className='role-pair'>
              <span>
                <Typography variant='caption3' tag='span'>
                  You bring
                </Typography>
                <Typography variant='body3' tag='span'>
                  {whoItsFor.cards[1].youBring}
                </Typography>
              </span>
              <span>
                <Typography variant='caption3' tag='span'>
                  We handle
                </Typography>
                <Typography variant='body3' tag='span'>
                  {whoItsFor.cards[1].weHandle}
                </Typography>
              </span>
            </div>
          </article>
        </div>
        <Link href='/case-studies/elacity-control-plane' className='proof-strip' aria-labelledby='case-title'>
          <Image
            className='proof-image'
            src='/images/case-studies/elicity/el1.webp'
            width={285}
            height={328}
            sizes='(max-width: 767px) 100vw, 155px'
            alt='Elacity Control Plane dashboard showing AI governance and prompt operations.'
          />
          <div>
            <Typography variant='body3' className='eyebrow' tag='p'>
              {whoItsFor.caseStudy.eyebrow}
            </Typography>
            <Typography variant='h3' id='case-title'>
              {whoItsFor.caseStudy.title}
            </Typography>
            <Typography variant='body3' className='case-description' tag='p'>
              {whoItsFor.caseStudy.description}
              <Typography variant='caption2' tag='span' className='case-stack'>
                {whoItsFor.caseStudy.stack}
              </Typography>
            </Typography>
          </div>
          <span className='text-link'>
            {whoItsFor.caseStudy.linkText}
            <Icon icon='ArrowUpRight' />
          </span>
        </Link>
      </ComponentContainer>
    </section>
  );
}
