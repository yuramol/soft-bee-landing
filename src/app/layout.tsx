import type { Metadata } from 'next';
import './globals.css';

import localFont from 'next/font/local';

import { Providers } from '@/app/providers';
import { Footer, MainLayout } from '@/components/layout';
import { cn } from '@/lib/utils';

import { Instrument_Sans } from 'next/font/google';

const fixel = localFont({
  src: [
    {
      path: '../assets/fonts/fixel/fixelText-Light.woff2',
      weight: '300',
      style: 'normal'
    },
    {
      path: '../assets/fonts/fixel/fixelText-Regular.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../assets/fonts/fixel/fixelText-Medium.woff2',
      weight: '500',
      style: 'normal'
    },
    {
      path: '../assets/fonts/fixel/fixelText-SemiBold.woff2',
      weight: '600',
      style: 'normal'
    }
  ],
  variable: '--font-sans',
  display: 'swap'
});

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap'
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
    <html lang='en' className={cn('h-full antialiased', 'font-sans', fixel.variable, instrumentSans.variable)}>
      <body className='flex min-h-screen flex-col'>
        <Providers>
          <MainLayout>{children}</MainLayout>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
