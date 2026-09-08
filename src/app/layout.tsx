import type { Metadata } from 'next';
import './globals.css';

import { Footer, MainLayout } from '@/components/layout';

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
    <html lang='en' className='h-full font-sans antialiased'>
      <body className='flex min-h-screen flex-col'>
        <MainLayout>{children}</MainLayout>
        <Footer />
      </body>
    </html>
  );
}
