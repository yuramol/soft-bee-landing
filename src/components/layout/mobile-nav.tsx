'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { DiscussProjectDialog } from '@/components/discuss-project-dialog';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useState } from 'react';
import { MAIN_NAV_LINKS } from '@/constants/navigation';

export interface MobileNavProps {
  burgerColor: string;
}

export function MobileNav({ burgerColor }: MobileNavProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsMobileMenuOpen(false);
  }

  const handleClose = () => setIsMobileMenuOpen(false);

  const handleDiscussProject = () => {
    setIsMobileMenuOpen(false);
    setTimeout(() => setIsProjectDialogOpen(true), 150);
  };

  return (
    <>
      <Drawer open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen} direction='right' shouldScaleBackground={false}>
        <DrawerTrigger asChild>
          <button type='button' className='lg:hidden'>
            <Icon icon='Burger' width={32} height={32} color={burgerColor} />
          </button>
        </DrawerTrigger>

        <DrawerContent className='bg-brand-white z-60 w-full flex-col px-4 pt-7.25 pb-6.25 lg:hidden'>
          <div className='mb-8.5 flex items-center justify-between'>
            <Link href='/' onClick={handleClose}>
              <Icon icon='Logo' width={165} height={37} />
            </Link>
            <button type='button' className='flex items-center justify-center' onClick={handleClose}>
              <Icon icon='X' width={24} height={24} fill='#1B1C23' />
            </button>
          </div>

          <nav className='mb-5'>
            <ul className='flex flex-col gap-1'>
              {MAIN_NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className='text-brand-black text-16 flex items-center leading-9.5 font-medium'
                    onClick={handleClose}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <Button variant='primary' className='w-full' onClick={handleDiscussProject}>
              Discuss project
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
      <DiscussProjectDialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen} />
    </>
  );
}
