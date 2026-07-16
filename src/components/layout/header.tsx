'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { DiscussProjectDialog } from '@/components/discuss-project-dialog';
import { MobileNav } from './mobile-nav';
import { cn } from '@/lib/utils';
import { MAIN_NAV_LINKS } from '@/constants/navigation';

export function Header({ className }: { className?: string }) {
  const pathname = usePathname();

  const isLightText = pathname === '/about';
  const textColor = isLightText ? 'text-brand-white' : 'text-brand-black';
  const burgerColor = isLightText ? '#FFFFFF' : '#1B1C23';

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-50 flex w-full items-center justify-between bg-transparent px-5.25 py-7.25 lg:pr-5.5 lg:pl-10.5',
        className
      )}
    >
      <div className='flex items-center'>
        <Link href='/'>
          <Icon icon={isLightText ? 'LogoWhite' : 'Logo'} width={165} height={37} />
        </Link>
      </div>

      <div className='flex items-center gap-31.25'>
        <nav className='hidden lg:block'>
          <ul className='flex items-center gap-11.25'>
            {MAIN_NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={cn('text-16 flex items-center font-medium whitespace-nowrap transition-opacity hover:opacity-80', textColor)}
                >
                  {link.label}
                  {link.label === 'About' && (
                    <Icon icon='ChevronDown' className='ml-1' width={16} height={16} color={isLightText ? '#FFFFFF' : '#1B1C23'} />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className='hidden items-center lg:flex'>
          <DiscussProjectDialog>
            <Button variant={isLightText ? 'white' : 'primary'} className='text-16 h-12 rounded-full px-6 font-medium'>
              Discuss project
            </Button>
          </DiscussProjectDialog>
        </div>

        <MobileNav burgerColor={burgerColor} />
      </div>
    </header>
  );
}
