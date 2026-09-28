'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { MAIN_NAV_LINKS } from '@/constants/navigation';
import { cn } from '@/lib/utils';

import { NavDropdown } from './nav-dropdown';
import { DiscussProjectButton } from '../discuss-project-button';
import { MobileNav } from './mobile-nav';

export interface HeaderProps {
  className?: string;
  theme?: 'light' | 'dark';
}

export function Header({ className, theme = 'light' }: HeaderProps) {
  const pathname = usePathname();
  const isLightText = theme === 'dark';
  const textColor = isLightText ? 'text-white' : 'text-foreground';
  const burgerColor = isLightText ? 'var(--brand-white)' : 'var(--foreground)';

  const handleDiscussPartnership = () => {
    const target = document.getElementById('partnership-form');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const focusTarget = document.getElementById('partner-name') ?? target.querySelector<HTMLElement>('[tabindex="-1"]');
      focusTarget?.focus({ preventScroll: true });
    }
  };

  return (
    <header
      className={cn(
        'absolute top-0 right-0 left-0 z-50 mx-auto flex w-full max-w-470 items-center justify-between bg-transparent px-5.25 py-7.25 min-[1200px]:pr-5.5 min-[1200px]:pl-8',
        className
      )}
    >
      <div className='flex items-center'>
        <Link href='/'>
          <Icon icon={isLightText ? 'LogoWhite' : 'Logo'} width={165} height={37} />
        </Link>
      </div>

      <div className='flex items-center gap-20 min-[1375px]:gap-62.25'>
        <nav className='hidden min-[1200px]:block'>
          <ul className='flex items-center gap-11.25'>
            {MAIN_NAV_LINKS.map((link) => (
              <li key={link.label}>
                {link.subLinks ? (
                  <NavDropdown label={link.label} subLinks={link.subLinks} textColor={textColor} />
                ) : (
                  <Link
                    href={link.href}
                    className={cn('text-16 flex items-center font-medium whitespace-nowrap transition-opacity hover:opacity-80', textColor)}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className='hidden items-center min-[1200px]:flex'>
          {pathname === '/partnership' ? (
            <Button
              variant={isLightText ? 'white' : 'primary'}
              className='rounded-full px-6 font-medium'
              rightIcon={<Icon icon='ArrowRight' />}
              onClick={handleDiscussPartnership}
            >
              Discuss a partnership
            </Button>
          ) : (
            <DiscussProjectButton
              variant={isLightText ? 'white' : 'primary'}
              className='rounded-full px-6 font-medium'
              text='Discuss project'
            />
          )}
        </div>

        <MobileNav burgerColor={burgerColor} />
      </div>
    </header>
  );
}
