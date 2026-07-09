'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';
import { Layout } from '@/components/layout/layout';
import { useUser } from '@/context';

function ProtectedApp({ children }: { children: React.ReactNode }) {
  const { user, isAuth, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!user) {
      router.replace(ROUTES.LOGIN);
    }
  }, [user, router, isLoading]);

  if (isLoading) return <div className='flex h-screen items-center justify-center'>Loading...</div>;
  if (!isAuth || !user) return null;

  return <Layout>{children}</Layout>;
}

export default function AppLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProtectedApp>{children}</ProtectedApp>;
}
