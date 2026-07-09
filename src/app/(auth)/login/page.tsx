import { Suspense } from 'react';

import { LoginScreen } from '@/components/login-screen';

function LoginFallback() {
  return (
    <div
      className='flex h-screen w-full items-center justify-center bg-[#0b162a] px-6 font-sans'
      role='status'
      aria-live='polite'
      aria-busy='true'
    >
      <div className='flex max-w-sm flex-col items-center gap-8 text-center'>
        <div className='space-y-2'>
          <p className='text-primary text-sm font-bold tracking-widest uppercase'>Welcome To</p>
          <h1 className='text-3xl leading-tight font-extrabold text-white sm:text-4xl'>Confyde</h1>
        </div>
        <div className='flex flex-col items-center gap-4'>
          <div className='border-t-primary h-10 w-10 animate-spin rounded-full border-2 border-white/15' aria-hidden />
          <p className='text-sm text-gray-400'>Getting your sign-in page ready…</p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginScreen />
    </Suspense>
  );
}
