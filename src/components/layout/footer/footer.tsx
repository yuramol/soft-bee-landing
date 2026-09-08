import Link from 'next/link';

import { DiscussProjectButton } from '@/components/discuss-project-button';
import { ComponentContainer } from '@/components/layout';
import { Divider } from '@/components/ui/divider';
import { FooterAnimatedBackground } from '@/components/ui/footer-animated-background';
import { Typography } from '@/components/ui/typography';

import { FooterNav, LogoMedusae } from './components';
import footerContent from './content.json';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='from-muted via-brand-white to-brand-white relative w-full shrink-0 overflow-x-clip bg-linear-to-b via-20% px-4 md:px-10.5'>
      <FooterAnimatedBackground className='-top-82.5 h-312.5' />

      <div className='relative z-10 w-full pt-31.25 pb-17 md:pt-80 md:pb-10'>
        <ComponentContainer>
          <div className='mb-19 flex flex-col items-center gap-9.5 md:mb-31.75 md:gap-16.25'>
            <Typography variant='h1' className='text-foreground tracking-[-0.58px] md:text-center'>
              {footerContent.title.map((line, index) => (
                <span key={line}>
                  {index > 0 ? <br /> : null}
                  {line}
                </span>
              ))}
            </Typography>

            <DiscussProjectButton className='text-14 w-full md:max-w-70.5' text={footerContent.cta} />
          </div>

          <Divider />

          <LogoMedusae />

          <FooterNav />

          <Divider className='mb-8.75' />

          <div className='flex flex-col items-center justify-between gap-5 text-sm md:flex-row'>
            <ul className='flex w-full flex-col justify-between gap-5 md:w-auto md:flex-row md:justify-start md:gap-5.75'>
              {footerContent.legalLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className='text-foreground text-16 font-medium transition-colors md:font-normal'>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className='mr-auto text-left md:mt-0 md:mr-0 md:text-right'>
              <Typography variant='description' className='text-foreground font-medium md:font-normal'>
                {footerContent.copyright} {currentYear}
              </Typography>
            </div>
          </div>
        </ComponentContainer>
      </div>
    </footer>
  );
};
