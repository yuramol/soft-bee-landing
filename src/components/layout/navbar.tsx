'use client';

import { LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants';
import { useUser } from '@/context/UserContext';

export const Navbar = () => {
  const { user, logout, isLoading } = useUser();
  const router = useRouter();

  async function handleSignOut() {
    await logout();
    router.push(ROUTES.LOGIN);
  }

  return (
    <header className='bg-foreground z-50 shrink-0 text-white shadow-md'>
      <div className='container flex items-center justify-between py-3'>
        <Link href={ROUTES.DASHBOARD} className='text-sm font-semibold tracking-wide'>
          Confyde
        </Link>

        <div className='flex items-center space-x-6'>
          <div className='flex items-center space-x-2'>
            <div className='rounded-full bg-white/10 p-1.5'>
              <User className='h-5 w-5 text-white' />
            </div>
            <span className='hidden text-sm font-medium sm:block'>{user?.name}</span>
          </div>

          <Button
            variant='white'
            isLoading={isLoading}
            onClick={() => void handleSignOut()}
            className='flex items-center space-x-1 border-0 text-xs font-bold tracking-wide text-white/60 uppercase transition-colors hover:bg-transparent hover:text-white'
          >
            <LogOut className='h-4 w-4' />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
