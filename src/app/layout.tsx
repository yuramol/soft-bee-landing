import type { Metadata } from 'next';
import './globals.css';

import localFont from 'next/font/local';

import { Footer, MainLayout } from '@/components/layout';
import { cn } from '@/lib/utils';

const fixel = localFont({
  src: [
    {
      path: '../assets/fonts/fixel/subset/fixel-light-latin.woff2',
      weight: '300',
      style: 'normal'
    },
    {
      path: '../assets/fonts/fixel/subset/fixel-regular-latin.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../assets/fonts/fixel/subset/fixel-medium-latin.woff2',
      weight: '500',
      style: 'normal'
    },
    {
      path: '../assets/fonts/fixel/subset/fixel-semibold-latin.woff2',
      weight: '600',
      style: 'normal'
    }
  ],
  variable: '--font-sans',
  display: 'swap',
  preload: true
});

export const metadata: Metadata = {
  title: 'SoftBee',
  description: 'SoftBee landing page'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={cn('h-full antialiased', 'font-sans', fixel.variable)}>
      <body className='flex min-h-screen flex-col'>
        <MainLayout>{children}</MainLayout>
        <Footer />
      </body>
    </html>
  );
}
