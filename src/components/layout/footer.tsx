import Image from 'next/image';
import Link from 'next/link';
import { Typography } from '../ui/typography';
import { Button } from '../ui/button';
import { Logo } from '@/assets/icons';
import { FOOTER_LINKS } from '@/constants/navigation';
import { ComponentContainer } from './component-container';
import { Divider } from '../ui/divider';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-brand-white relative w-full shrink-0 overflow-hidden'>
      <div
        className='pointer-events-none absolute inset-x-0 -top-75 z-0 h-250 w-full md:-top-20'
        style={{
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
        }}
      >
        <Image src='/backgrounds/footer-bg.png' alt='Background' fill className='object-cover object-center' priority />
      </div>

      <div className='relative z-10 w-full pt-31.25 pb-17 md:pt-80 md:pb-10'>
        <ComponentContainer>
          <div className='mb-19 flex flex-col items-center gap-9.5 md:mb-31.75 md:gap-16.25'>
            <Typography variant='h1' className='text-brand-black tracking-[-0.58px] md:text-center'>
              Have a vision in mind?
              <br />
              Let’s build the roadmap together
            </Typography>

            <Button className='w-full md:w-auto'>Plan your project with us</Button>
          </div>

          <Divider className='mb-7.75 md:mb-31.5' />

          <div className='mb-13.75 flex w-full justify-center md:mb-26.25'>
            <Logo className='text-brand-black h-auto w-full' />
          </div>

          <nav
            className='text-brand-black mb-7.25 flex flex-col gap-11.25 md:mb-9 md:flex-row md:justify-between'
            aria-label='Footer Navigation'
          >
            <div className='flex flex-col gap-5'>
              <Typography variant='description'>Kyiv</Typography>
              <ul className='flex flex-col gap-5'>
                <li>
                  <Link href='mailto:hello@softbee.com' className='text-brand-black/50 hover:text-brand-black transition-colors'>
                    hello@softbee.com
                  </Link>
                </li>
                <li>
                  <Link href='tel:+0000000000' className='text-brand-black/50 hover:text-brand-black transition-colors'>
                    (+00) 0000 000 0
                  </Link>
                </li>
              </ul>
            </div>

            {FOOTER_LINKS.map((section) => (
              <div key={section.title} className='flex flex-col gap-5'>
                <Typography variant='description'>{section.title}</Typography>
                <ul className='flex flex-col gap-5'>
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        target={link.target}
                        rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                        className='text-brand-black/60 hover:text-brand-black transition-colors'
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <Divider className='mb-8.75' />

          <div className='flex flex-col items-center justify-between gap-5 text-sm md:flex-row'>
            <ul className='flex w-full flex-col justify-between gap-5 md:w-auto md:flex-row md:justify-start md:gap-5.75'>
              <li>
                <Link href='#' className='text-brand-black text-16 font-medium transition-colors md:font-normal'>
                  Terms of use
                </Link>
              </li>
              <li>
                <Link href='#' className='text-brand-black text-16 font-medium transition-colors md:font-normal'>
                  Privacy policy
                </Link>
              </li>
            </ul>
            <div className='mr-auto text-left md:mt-0 md:mr-0 md:text-right'>
              <Typography variant='description' className='text-brand-black font-medium md:font-normal'>
                {' '}
                Soft Bee © All rights reserved, {currentYear}
              </Typography>
            </div>
          </div>
        </ComponentContainer>
      </div>
    </footer>
  );
};
