import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { ROUTES } from '@/constants';

export default function Home() {
  return (
    <main className='bg-background text-foreground flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center'>
      <div className='space-y-4'>
        <h1 className='text-4xl font-extrabold tracking-tight sm:text-5xl'>Confyde</h1>
        <p className='text-muted-foreground mx-auto max-w-md text-lg'>Your landing page starts here.</p>
      </div>

      <Link href={ROUTES.LOGIN} className={buttonVariants({ variant: 'primary', size: 'lg' })}>
        Sign in
      </Link>
    </main>
  );
}
