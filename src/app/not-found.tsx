import type { Metadata } from 'next';

import { Header } from '@/components/layout';
import { NotFound } from '@/components/sections/not-found';

export const metadata: Metadata = {
  title: '404 - Page Not Found | Soft Bee',
  description:
    'The page you’re looking for doesn’t exist or has been moved. Explore Soft Bee services, case studies, insights, and careers.'
};

export default function NotFoundPage() {
  return (
    <>
      <Header theme='light' />
      <NotFound />
    </>
  );
}
