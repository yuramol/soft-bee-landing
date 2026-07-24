import Link from 'next/link';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { Typography } from '@/components/ui/typography';
import { Logo } from '@/assets/icons';
import { ComponentContainer } from '@/components/layout';
import { Divider } from '@/components/ui/divider';

import { FooterNav } from './components';
import { DiscussProjectButton } from '@/components/discuss-project-button';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='from-muted via-brand-white to-brand-white relative w-full shrink-0 overflow-x-clip bg-linear-to-b via-20% px-4 md:px-10.5'>
      <AnimatedBackground className='-top-82.5 h-312.5' />

      <div className='relative z-10 w-full pt-31.25 pb-17 md:pt-80 md:pb-10'>
        <ComponentContainer>
          <div className='mb-19 flex flex-col items-center gap-9.5 md:mb-31.75 md:gap-16.25'>
            <Typography variant='h1' className='text-foreground tracking-[-0.58px] md:text-center'>
              Have a vision in mind?
              <br />
              Let’s build the roadmap together
            </Typography>

            <DiscussProjectButton className='text-14 w-full md:max-w-70.5' text='Plan your project with us' />
          </div>

          <Divider className='mb-7.75 md:mb-31.5' />

          <div className='mb-13.75 flex w-full justify-center md:mb-26.25'>
            <Logo className='text-foreground h-auto w-full' />
          </div>

          <FooterNav />

          <Divider className='mb-8.75' />

          <div className='flex flex-col items-center justify-between gap-5 text-sm md:flex-row'>
            <ul className='flex w-full flex-col justify-between gap-5 md:w-auto md:flex-row md:justify-start md:gap-5.75'>
              <li>
                <Link href='#' className='text-foreground text-16 font-medium transition-colors md:font-normal'>
                  Terms of use
                </Link>
              </li>
              <li>
                <Link href='#' className='text-foreground text-16 font-medium transition-colors md:font-normal'>
                  Privacy policy
                </Link>
              </li>
            </ul>
            <div className='mr-auto text-left md:mt-0 md:mr-0 md:text-right'>
              <Typography variant='description' className='text-foreground font-medium md:font-normal'>
                Soft Bee © All rights reserved, {currentYear}
              </Typography>
            </div>
          </div>
        </ComponentContainer>
      </div>
    </footer>
  );
};
